'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import MediaUpload from '@/components/admin/MediaUpload';
import { Plus, Trash2, Loader2, Save, X, Film } from 'lucide-react';

interface Reel {
  id?: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  is_featured: boolean;
}

const CATEGORIES = [
  'wedding-photography', 'engagement-photography', 'modeling-photography',
  'product-photography', 'maternity-photography', 'corporate-event-photography',
  'birthday-photography', 'children-photography', 'indoor-studio-photography',
];

const EMPTY: Reel = { title: '', video_url: '', thumbnail_url: '', category: 'wedding-photography', is_featured: false };

export default function ReelsAdminPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb.from('reels').select('*').order('published_at', { ascending: false });
    setReels(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    const sb = createClient();
    const { error: err } = editing.id
      ? await sb.from('reels').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      : await sb.from('reels').insert({ ...editing, published_at: new Date().toISOString() });
    if (err) setError(err.message);
    else { setEditing(null); load(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reel?')) return;
    await createClient().from('reels').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white font-light tracking-wide">Video Reels</h1>
          <p className="text-neutral-500 text-sm mt-1">Upload and manage your cinematic video reels</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
          <Plus className="w-4 h-4" /> Add Reel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {reels.length === 0 && (
          <div className="col-span-3 text-center py-16 text-neutral-600 border border-dashed border-neutral-700 rounded-xl">No reels yet. Click "Add Reel" to upload your first video.</div>
        )}
        {reels.map((reel) => (
          <div key={reel.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden group">
            <div className="relative aspect-video bg-neutral-900 flex items-center justify-center">
              {reel.thumbnail_url ? (
                <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover" />
              ) : (
                <Film className="w-10 h-10 text-neutral-700" />
              )}
              {reel.is_featured && (
                <span className="absolute top-2 left-2 bg-[#C9A86C] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Featured</span>
              )}
            </div>
            <div className="p-4">
              <p className="text-white text-sm font-medium truncate">{reel.title}</p>
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider mt-0.5">{reel.category.replace(/-/g, ' ')}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing(reel)} className="flex-1 text-xs text-[#C9A86C] border border-[#C9A86C]/30 py-1.5 rounded-lg hover:border-[#C9A86C] transition-all text-center">Edit</button>
                <button onClick={() => handleDelete(reel.id!)} className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-semibold">{editing.id ? 'Edit' : 'New'} Reel</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-neutral-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Title *</label>
                <input required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>
              <MediaUpload type="video" folder="reels" currentUrl={editing.video_url} onUpload={url => setEditing({ ...editing, video_url: url })} label="Video File *" />
              <MediaUpload type="image" folder="reels/thumbnails" currentUrl={editing.thumbnail_url} onUpload={url => setEditing({ ...editing, thumbnail_url: url })} label="Thumbnail Image (optional)" />
              <div className="flex items-center gap-3">
                <input type="checkbox" id="r-feat" checked={editing.is_featured} onChange={e => setEditing({ ...editing, is_featured: e.target.checked })} className="w-4 h-4 accent-[#C9A86C]" />
                <label htmlFor="r-feat" className="text-sm text-neutral-300">Featured reel (shown on homepage)</label>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Reel'}
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
