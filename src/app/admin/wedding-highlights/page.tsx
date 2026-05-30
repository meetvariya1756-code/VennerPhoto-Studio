'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import MediaUpload from '@/components/admin/MediaUpload';
import { Plus, Trash2, Loader2, Save, X, Film, Video, Eye, EyeOff } from 'lucide-react';
import { triggerRevalidation } from '@/lib/revalidate';

interface WeddingHighlight {
  id?: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  seo_title?: string;
  seo_description?: string;
  is_active: boolean;
  display_order: number;
}

const EMPTY_HIGHLIGHT: WeddingHighlight = {
  title: '',
  video_url: '',
  thumbnail_url: '',
  seo_title: '',
  seo_description: '',
  is_active: true,
  display_order: 0,
};

export default function WeddingHighlightsAdminPage() {
  const [highlights, setHighlights] = useState<WeddingHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WeddingHighlight | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const sb = createClient();
    const { data, error: fetchErr } = await sb
      .from('wedding_highlights')
      .select('*')
      .order('display_order');
    if (fetchErr) {
      console.error('Error fetching highlights:', fetchErr.message);
    }
    setHighlights(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    const sb = createClient();

    // Map fields and set default order if not provided
    const payload = {
      title: editing.title,
      video_url: editing.video_url,
      thumbnail_url: editing.thumbnail_url || null,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
      is_active: editing.is_active,
      display_order: editing.display_order,
    };

    const { error: err } = editing.id
      ? await sb
          .from('wedding_highlights')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editing.id)
      : await sb.from('wedding_highlights').insert({ ...payload });

    if (err) {
      setError(err.message);
    } else {
      setEditing(null);
      load();
      triggerRevalidation();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wedding highlight?')) return;
    const sb = createClient();
    const { error: err } = await sb.from('wedding_highlights').delete().eq('id', id);
    if (err) {
      alert(`Failed to delete: ${err.message}`);
    } else {
      load();
      triggerRevalidation();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Wedding Highlights</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage landscape wedding showcase films on the homepage</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_HIGHLIGHT, display_order: highlights.length + 1 })}
          className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Highlight
        </button>
      </div>

      {/* Grid of widescreen cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {highlights.length === 0 && (
          <div className="col-span-3 text-center py-16 text-neutral-400 bg-white border border-neutral-200 rounded-xl shadow-sm">
            No wedding highlights yet. Click "Add Highlight" to upload your first cinematic video.
          </div>
        )}
        {highlights.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden group shadow-sm flex flex-col justify-between">
            <div className="relative aspect-video bg-neutral-100 flex items-center justify-center border-b border-neutral-200 overflow-hidden">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : item.video_url ? (
                <video
                  src={item.video_url}
                  preload="metadata"
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-neutral-400">
                  <Video className="w-8 h-8 stroke-1" />
                  <span className="text-[10px]">No Video Preview</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${
                    item.is_active
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-500 text-white'
                  }`}
                >
                  {item.is_active ? 'Active' : 'Hidden'}
                </span>
                <span className="bg-neutral-900/85 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                  Order: {item.display_order}
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[#1A1A1A] text-sm font-semibold truncate">{item.title}</p>
                {item.seo_title && (
                  <p className="text-neutral-400 text-[10px] truncate mt-1">
                    <strong className="text-neutral-500">SEO Title:</strong> {item.seo_title}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditing(item)}
                  className="flex-1 text-xs text-[#C9A86C] border border-[#C9A86C]/40 py-1.5 rounded-lg hover:bg-neutral-900 hover:text-white transition-all text-center font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 transition-all border border-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/New Highlight Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-[#1A1A1A] font-semibold text-lg font-serif">{editing.id ? 'Edit' : 'New'} Wedding Highlight</h2>
              <button onClick={() => setEditing(null)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-[#1A1A1A]" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Highlight Title (Short Title) *
                </label>
                <input
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Royal Palace Union"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm"
                />
              </div>

              {/* Landscape Video Upload */}
              <MediaUpload
                type="video"
                folder="wedding-highlights"
                currentUrl={editing.video_url}
                onUpload={(url) => setEditing({ ...editing, video_url: url })}
                label="Horizontal Landscape Video (16:9) *"
              />

              {/* Cover Poster Image Upload */}
              <MediaUpload
                type="image"
                folder="wedding-highlights/thumbnails"
                currentUrl={editing.thumbnail_url}
                onUpload={(url) => setEditing({ ...editing, thumbnail_url: url })}
                label="Poster Cover Thumbnail (optional)"
              />

              {/* Advanced SEO Metadata Section */}
              <div className="border-t border-neutral-200 pt-4 mt-2">
                <h3 className="text-xs font-bold text-[#C9A86C] uppercase tracking-widest mb-3">SEO Metadata Fields</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                      SEO Title
                    </label>
                    <input
                      value={editing.seo_title || ''}
                      onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })}
                      placeholder="e.g. Cinematic Wedding Highlights at Royal Palace | Venner Photo Studio"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                      SEO Description
                    </label>
                    <textarea
                      value={editing.seo_description || ''}
                      onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })}
                      placeholder="e.g. Watch the stunning landscape cinematic wedding film captured beautifully by Venner Photo Studio in golden light."
                      rows={3}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors resize-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Positioning & Visibility */}
              <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editing.display_order}
                    onChange={(e) => setEditing({ ...editing, display_order: +e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm"
                  />
                </div>
                <div className="flex items-end pb-2.5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="active-toggle"
                      checked={editing.is_active}
                      onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A86C]"
                    />
                    <label htmlFor="active-toggle" className="text-sm text-neutral-600 font-medium">
                      Active (Show on homepage)
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2 border-t border-neutral-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60 shadow-md"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Highlight'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="text-neutral-500 hover:text-neutral-700 border border-neutral-300 hover:bg-neutral-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
