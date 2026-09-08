'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { compressImageFile } from '@/lib/utils';

interface MediaUploadProps {
  type: 'image' | 'video';
  bucket?: string;
  folder?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  onUploadMultiple?: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  accept?: string;
}

export default function MediaUpload({
  type,
  bucket = 'media',
  folder = 'uploads',
  currentUrl,
  onUpload,
  onUploadMultiple,
  multiple = false,
  label,
  accept,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFilesCount, setTotalFilesCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl || '');

  React.useEffect(() => {
    setPreview(currentUrl || '');
  }, [currentUrl]);

  const defaultAccept = type === 'image'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'video/mp4,video/webm,video/mov';

  const handleFiles = useCallback(async (files: FileList) => {
    setError('');
    setUploading(true);
    setProgress(5);
    setTotalFilesCount(files.length);
    
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i + 1);
        const rawFile = files[i];
        
        // Auto-compress image before upload to prevent server payload errors
        const file = type === 'image' ? await compressImageFile(rawFile) : rawFile;

        let publicUrl = '';
        try {
          const body = new FormData();
          body.append('file', file);
          body.append('folder', folder);

          const res = await fetch('/api/upload', {
            method: 'POST',
            body,
          });

          if (!res.ok) {
            throw new Error(`Upload server error: ${res.statusText}`);
          }

          const resData = await res.json();
          if (resData.error) {
            throw new Error(resData.error);
          }
          publicUrl = resData.url;
        } catch (err) {
          // Instant Local Fallback: Convert uploaded file to Data URL
          publicUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        uploadedUrls.push(publicUrl);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (multiple && onUploadMultiple) {
        onUploadMultiple(uploadedUrls);
      } else if (uploadedUrls.length > 0) {
        setPreview(uploadedUrls[0]);
        onUpload(uploadedUrls[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please check server logs.');
    } finally {
      setUploading(false);
      setTimeout(() => {
        setProgress(0);
        setTotalFilesCount(0);
      }, 1000);
    }
  }, [folder, multiple, onUpload, onUploadMultiple]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-sans font-semibold text-neutral-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Current Media Preview (only if single upload) */}
      {!multiple && preview && (
        <div className="relative mb-3 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
          {type === 'image' ? (
            <ImageWithFallback src={preview} alt="Preview" fallbackType="photo" className="w-full h-48" />
          ) : (
            <video src={preview} className="w-full h-48 object-cover" controls />
          )}
          <button
            type="button"
            onClick={() => { setPreview(''); onUpload(''); }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drop Zone */}
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-600 hover:border-[#C9A86C] rounded-lg cursor-pointer bg-neutral-800/50 hover:bg-neutral-800 transition-all duration-200 relative overflow-hidden"
      >
        <input
          type="file"
          className="hidden"
          accept={accept || defaultAccept}
          onChange={handleChange}
          disabled={uploading}
          multiple={multiple}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" />
            <span className="text-xs text-neutral-400">
              {totalFilesCount > 1 
                ? `Uploading photo ${currentFileIndex} of ${totalFilesCount}... (${progress}%)`
                : `${progress}% uploaded`
              }
            </span>
            <div className="w-32 h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A86C] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400">
            {type === 'image' ? (
              <ImageIcon className="w-6 h-6" />
            ) : (
              <Film className="w-6 h-6" />
            )}
            <span className="text-xs">
              <span className="text-[#C9A86C] font-semibold">Click to upload</span> or drag & drop {multiple && 'multiple photos'}
            </span>
            <span className="text-[10px] text-neutral-500">
              {type === 'image' ? 'JPG, PNG, WEBP up to 10MB' : 'MP4, WEBM, MOV up to 100MB'}
            </span>
          </div>
        )}
      </label>

      {error && (
        <p className="mt-2 text-xs text-red-400 font-sans">{error}</p>
      )}

      {/* Manual URL input fallback (only for single upload) */}
      {!multiple && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Or paste direct URL..."
            value={preview}
            onChange={(e) => { setPreview(e.target.value); onUpload(e.target.value); }}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86C] transition-colors"
          />
        </div>
      )}
    </div>
  );
}
