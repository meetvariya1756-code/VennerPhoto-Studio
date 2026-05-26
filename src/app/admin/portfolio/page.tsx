'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { Plus, Trash2, Loader2, Save, X, Upload, Star } from 'lucide-react';

interface Photo {
  id?: string;
  title: string;
  image_url: string;
  category: string;
  alt_text: string;
  tags: string[];
  is_featured: boolean;
}

const CATEGORIES = [
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
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb.from('portfolio_photos').select('*').order('created_at', { ascending: false });
    setPhotos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Bulk upload multiple images at once
  const handleBulkUpload = async (files: FileList) => {
    setUploading(true);
    const sb = createClient();
    const uploads = Array.from(files).map(async (file) => {
      const ext = file.name.split('.').pop();
      const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await sb.storage.from('media').upload(path, file, { upsert: true });
      if (error || !data) return;
      const { data: { publicUrl } } = sb.storage.from('media').getPublicUrl(data.path);
      await sb.from('portfolio_photos').insert({
        title: file.name.replace(/\.[^/.]+$/, ''),
        image_url: publicUrl,
        category: 'wedding-photography',
        is_featured: false,
        tags: [],
      });
    });
    await Promise.all(uploads);
    setUploading(false);
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    const sb = createClient();
    const { error: err } = editing.id
      ? await sb.from('portfolio_photos').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      : await sb.from('portfolio_photos').insert(editing);
    if (err) setError(err.message);
    else { setEditing(null); load(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return;
    await createClient().from('portfolio_photos').delete().eq('id', id);
    load();
  };

  const toggleFeatured = async (photo: Photo) => {
    await createClient().from('portfolio_photos').update({ is_featured: !photo.is_featured }).eq('id', photo.id!);
    load();
  };

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white font-light tracking-wide">Portfolio Photos</h1>
          <p className="text-neutral-500 text-sm mt-1">{photos.length} photos · {photos.filter(p => p.is_featured).length} featured</p>
        </div>
        <div className="flex gap-3">
          {/* Bulk Upload */}
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleBulkUpload(e.target.files)} />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-60 border border-neutral-700">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Bulk Upload'}
          </button>
          <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-[#C9A86C] text-[#1A1A1A]' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setFilter(c.value)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${filter === c.value ? 'bg-[#C9A86C] text-[#1A1A1A]' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>{c.label}</button>
        ))}
      </div>

      {/* Photo Grid */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-neutral-600 border border-dashed border-neutral-700 rounded-xl">No photos in this category yet.</div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((photo) => (
          <div key={photo.id} className="group relative aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
            <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => setEditing(photo)} className="bg-white/20 hover:bg-[#C9A86C] text-white hover:text-[#1A1A1A] text-xs px-3 py-1.5 rounded-lg transition-all font-semibold">Edit</button>
              <button onClick={() => handleDelete(photo.id!)} className="bg-red-600/80 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all">Delete</button>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-semibold">{editing.id ? 'Edit' : 'Add'} Photo</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Preview / URL */}
              {editing.image_url && (
                <img src={editing.image_url} alt="" className="w-full h-48 object-cover rounded-xl mb-2" />
              )}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Image URL *</label>
                <input required value={editing.image_url} onChange={e => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://... or upload via Bulk Upload" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Title</label>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Alt Text (SEO)</label>
                <input value={editing.alt_text} onChange={e => setEditing({ ...editing, alt_text: e.target.value })} placeholder="Describe the image for accessibility" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="p-feat" checked={editing.is_featured} onChange={e => setEditing({ ...editing, is_featured: e.target.checked })} className="w-4 h-4 accent-[#C9A86C]" />
                <label htmlFor="p-feat" className="text-sm text-neutral-300">Featured (shown on homepage)</label>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Photo'}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="text-neutral-400 hover:text-white border border-neutral-700 px-6 py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
