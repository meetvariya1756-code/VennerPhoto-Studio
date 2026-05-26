'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface MediaUploadProps {
  type: 'image' | 'video';
  bucket?: string;
  folder?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
}

export default function MediaUpload({
  type,
  bucket = 'media',
  folder = 'uploads',
  currentUrl,
  onUpload,
  label,
  accept,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl || '');

  const defaultAccept = type === 'image'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'video/mp4,video/webm,video/mov';

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(10);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      setProgress(30);

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      setProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setPreview(publicUrl);
      onUpload(publicUrl);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please check your Supabase configuration.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [bucket, folder, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-sans font-semibold text-neutral-300 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Current Media Preview */}
      {preview && (
        <div className="relative mb-3 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
          {type === 'image' ? (
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
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
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" />
            <span className="text-xs text-neutral-400">{progress}% uploaded</span>
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
              <span className="text-[#C9A86C] font-semibold">Click to upload</span> or drag & drop
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

      {/* Manual URL input fallback */}
      <div className="mt-2">
        <input
          type="url"
          placeholder="Or paste direct URL..."
          value={preview}
          onChange={(e) => { setPreview(e.target.value); onUpload(e.target.value); }}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86C] transition-colors"
        />
      </div>
    </div>
  );
}
