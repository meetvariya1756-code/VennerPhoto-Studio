'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MediaUpload from '@/components/admin/MediaUpload';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Plus, Trash2, Loader2, Save, X, Upload, Star } from 'lucide-react';
import { triggerRevalidation } from '@/lib/revalidate';
import { compressImageFile } from '@/lib/utils';

interface Photo {
  id?: string;
  title: string;
  image_url: string;
  category: string;
  alt_text: string;
  tags: string[];
  is_featured: boolean;
}

const FALLBACK_CATEGORIES = [
  { value: 'wedding-photography', label: 'Wedding' },
  { value: 'engagement-photography', label: 'Engagement' },
  { value: 'baby-shower-photography', label: 'Baby Shower' },
  { value: 'children-photography', label: 'Children' },
  { value: 'indoor-studio-photography', label: 'Indoor Studio' },
  { value: 'product-photography', label: 'Product' },
  { value: 'modeling-photography', label: 'Modeling' },
  { value: 'corporate-event-photography', label: 'Corporate Event' },
  { value: 'birthday-photography', label: 'Birthday' },
  { value: 'maternity-photography', label: 'Maternity' },
];

const EMPTY: Photo = { title: '', image_url: '', category: 'wedding-photography', alt_text: '', tags: [], is_featured: false };

export default function PortfolioAdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/portfolio_photos?order=created_at.desc&t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load portfolio photos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/services?order=display_order.asc&t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data.map((s: any) => ({
          value: s.slug,
          label: s.title.replace(/\s+photography$/i, '')
        })));
      }
    } catch (err) {
      console.error('Failed to load services for portfolio admin:', err);
    }
  }, []);

  useEffect(() => {
    load();
    loadCategories();
  }, [load, loadCategories]);

  // Bulk upload multiple images at once
  const handleBulkUpload = async (files: FileList) => {
    setUploading(true);
    const fileArray = Array.from(files);
    for (const rawFile of fileArray) {
      try {
        const file = await compressImageFile(rawFile);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'portfolio');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.url) continue;

        await fetch('/api/admin/portfolio_photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: rawFile.name.replace(/\.[^/.]+$/, ''),
            image_url: uploadData.url,
            category: 'wedding-photography',
            is_featured: false,
            tags: [],
          }),
        });
      } catch (err) {
        console.error('Failed to bulk upload file:', rawFile.name, err);
      }
    }
    setUploading(false);
    load();
    triggerRevalidation();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    try {
      const isUpdate = !!editing.id;
      const url = isUpdate ? `/api/admin/portfolio_photos?id=${editing.id}` : '/api/admin/portfolio_photos';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save photo');
      }

      setEditing(null);
      load();
      triggerRevalidation();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this photo?')) return;
    setPhotos(p => p.filter(x => x.id !== id));
    try {
      await fetch(`/api/admin/portfolio_photos?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      load();
      triggerRevalidation();
    } catch (err) {
      console.error('Failed to delete portfolio photo:', err);
    }
  };

  const toggleFeatured = async (photo: Photo) => {
    if (!photo.id) return;
    await fetch(`/api/admin/portfolio_photos?id=${photo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: !photo.is_featured }),
    });
    load();
    triggerRevalidation();
  };

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Portfolio Photos</h1>
          <p className="text-neutral-500 text-sm mt-1">{photos.length} photos · {photos.filter(p => p.is_featured).length} featured</p>
        </div>
        <div className="flex gap-3">
          {/* Bulk Upload */}
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleBulkUpload(e.target.files)} />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-[#1A1A1A] text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-60 border border-neutral-300 shadow-sm">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Bulk Upload'}
          </button>
          <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${filter === 'all' ? 'bg-[#1A1A1A] text-[#C9A86C] border-[#1A1A1A]' : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'}`}>All</button>
        {categories.map(c => (
          <button key={c.value} onClick={() => setFilter(c.value)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${filter === c.value ? 'bg-[#1A1A1A] text-[#C9A86C] border-[#1A1A1A]' : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'}`}>{c.label}</button>
        ))}
      </div>

      {/* Photo Grid */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-400 bg-white border border-neutral-200 rounded-xl shadow-sm">No photos in this category yet.</div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((photo) => (
          <div key={photo.id} className="group relative aspect-square bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
            <ImageWithFallback src={photo.image_url} alt={photo.title} fallbackType="photo" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button type="button" onClick={() => setEditing(photo)} className="bg-white/25 hover:bg-[#C9A86C] text-white hover:text-[#1A1A1A] text-xs px-3 py-1.5 rounded-lg transition-all font-semibold">Edit</button>
              <button type="button" onClick={() => photo.id && handleDelete(photo.id)} className="bg-red-600/80 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all">Delete</button>
            </div>
            {/* Featured badge */}
            <button onClick={() => toggleFeatured(photo)} className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${photo.is_featured ? 'bg-[#C9A86C]' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
              <Star className={`w-3 h-3 ${photo.is_featured ? 'text-[#1A1A1A] fill-current' : 'text-white'}`} />
            </button>
            {/* Category label */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-[9px] uppercase tracking-wider truncate">{photo.category.replace('-photography', '').replace(/-/g, ' ')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-[#1A1A1A] font-semibold">{editing.id ? 'Edit' : 'Add'} Photo</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-neutral-400 hover:text-[#1A1A1A]" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload Component */}
              <MediaUpload
                type="image"
                folder="portfolio"
                currentUrl={editing.image_url}
                onUpload={(url) => setEditing({ ...editing, image_url: url })}
                label="Upload Image File *"
              />
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Title</label>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm">
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Alt Text (SEO)</label>
                <input value={editing.alt_text} onChange={e => setEditing({ ...editing, alt_text: e.target.value })} placeholder="Describe the image for accessibility" className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="p-feat" checked={editing.is_featured} onChange={e => setEditing({ ...editing, is_featured: e.target.checked })} className="w-4 h-4 accent-[#C9A86C]" />
                <label htmlFor="p-feat" className="text-sm text-neutral-600">Featured (shown on homepage)</label>
              </div>
              {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60 shadow-md">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="text-neutral-500 hover:text-neutral-700 border border-neutral-300 hover:bg-neutral-50 px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
