'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import MediaUpload from '@/components/admin/MediaUpload';
import { Plus, Trash2, Loader2, Save, X } from 'lucide-react';

interface Hero {
  id?: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image_url: string;
  mobile_background_image_url?: string;
  is_active: boolean;
  display_order: number;
}

const EMPTY_HERO: Hero = {
  title: '',
  subtitle: '',
  cta_text: 'Book Your Session',
  cta_link: '/contact',
  background_image_url: '',
  mobile_background_image_url: '',
  is_active: true,
  display_order: 0,
};

export default function HeroesAdminPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Hero | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb.from('heroes').select('*').order('display_order');
    setHeroes(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    const sb = createClient();
    const { error: err } = editing.id
      ? await sb.from('heroes').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      : await sb.from('heroes').insert({ ...editing });
    if (err) setError(err.message);
    else { setEditing(null); load(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hero banner?')) return;
    const sb = createClient();
    await sb.from('heroes').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Hero Banners</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your homepage full-screen banners</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_HERO, display_order: heroes.length + 1 })}
          className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Heroes List */}
      <div className="space-y-4">
        {heroes.length === 0 && (
          <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-300 rounded-xl bg-white shadow-sm">
            No hero banners yet. Click "Add Banner" to create one.
          </div>
        )}
        {heroes.map((hero) => (
          <div key={hero.id} className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden flex items-center gap-4 p-4 group shadow-sm">
            <div className="flex gap-2 shrink-0">
              {hero.background_image_url && (
                <div className="relative">
                  <img src={hero.background_image_url} alt="Desktop" className="w-20 h-14 object-cover rounded-lg border border-neutral-200" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded font-semibold">Desk</span>
                </div>
              )}
              {hero.mobile_background_image_url && (
                <div className="relative">
                  <img src={hero.mobile_background_image_url} alt="Mobile" className="w-10 h-14 object-cover rounded-lg border border-neutral-200" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded font-semibold">Mob</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A1A] font-semibold text-sm truncate">{hero.title}</p>
              <p className="text-neutral-400 text-xs truncate mt-0.5">{hero.subtitle}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${hero.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}>
                  {hero.is_active ? 'Active' : 'Hidden'}
                </span>
                <span className="text-[10px] text-neutral-400">Order: {hero.display_order}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(hero)} className="text-xs text-[#C9A86C] hover:bg-neutral-900 hover:text-white border border-[#C9A86C]/40 px-3 py-1.5 rounded-lg transition-all">Edit</button>
              <button onClick={() => handleDelete(hero.id!)} className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-[#1A1A1A] font-semibold">{editing.id ? 'Edit' : 'New'} Hero Banner</h2>
              <button onClick={() => setEditing(null)} className="text-neutral-400 hover:text-[#1A1A1A]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Title *</label>
                <input required value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Subtitle</label>
                <textarea value={editing.subtitle} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} rows={2} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors resize-none shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">CTA Button Text</label>
                  <input value={editing.cta_text} onChange={e => setEditing({ ...editing, cta_text: e.target.value })} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">CTA Button Link</label>
                  <input value={editing.cta_link} onChange={e => setEditing({ ...editing, cta_link: e.target.value })} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MediaUpload type="image" folder="heroes" currentUrl={editing.background_image_url} onUpload={url => setEditing({ ...editing, background_image_url: url })} label="Desktop Background Image * (Recommended: 1920x1080px)" />
                <MediaUpload type="image" folder="heroes" currentUrl={editing.mobile_background_image_url || ''} onUpload={url => setEditing({ ...editing, mobile_background_image_url: url })} label="Mobile Background Image (Optional) (Recommended: 1080x1920px)" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 accent-[#C9A86C]" />
                <label htmlFor="active" className="text-sm text-neutral-600">Active (visible on website)</label>
              </div>
              {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60 shadow-md">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Banner'}
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
