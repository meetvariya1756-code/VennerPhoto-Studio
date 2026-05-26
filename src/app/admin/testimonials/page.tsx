'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import MediaUpload from '@/components/admin/MediaUpload';
import { Plus, Trash2, Loader2, Save, X, Star } from 'lucide-react';

interface Testimonial {
  id?: string;
  client_name: string;
  service_type: string;
  quote: string;
  rating: number;
  is_active: boolean;
}

const EMPTY: Testimonial = { client_name: '', service_type: '', quote: '', rating: 5, is_active: true };

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb.from('testimonials').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true); setError('');
    const sb = createClient();
    const { error: err } = editing.id
      ? await sb.from('testimonials').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      : await sb.from('testimonials').insert(editing);
    if (err) setError(err.message);
    else { setEditing(null); load(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await createClient().from('testimonials').delete().eq('id', id);
    load();
  };

  const toggleActive = async (item: Testimonial) => {
    await createClient().from('testimonials').update({ is_active: !item.is_active }).eq('id', item.id!);
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Testimonials</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage client reviews and ratings</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-16 text-neutral-400 bg-white border border-neutral-200 rounded-xl shadow-sm">No testimonials yet.</div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-neutral-200/60 rounded-xl p-5 flex items-start gap-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#1A1A1A] font-semibold text-sm">{item.client_name}</span>
                <span className="text-neutral-400 text-xs">— {item.service_type}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < item.rating ? 'text-[#C9A86C] fill-current' : 'text-neutral-200'}`} />
                ))}
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed line-clamp-2 italic">"{item.quote}"</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActive(item)} className={`text-[10px] px-2.5 py-1 rounded-full transition-all border ${item.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'}`}>
                {item.is_active ? 'Active' : 'Hidden'}
              </button>
              <button onClick={() => setEditing(item)} className="text-xs text-[#C9A86C] border border-[#C9A86C]/40 px-3 py-1.5 rounded-lg hover:bg-neutral-900 hover:text-white transition-all">Edit</button>
              <button onClick={() => handleDelete(item.id!)} className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-[#1A1A1A] font-semibold">{editing.id ? 'Edit' : 'New'} Testimonial</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-neutral-400 hover:text-[#1A1A1A]" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Client Name *</label>
                <input required value={editing.client_name} onChange={e => setEditing({ ...editing, client_name: e.target.value })} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Service Type</label>
                <input value={editing.service_type} onChange={e => setEditing({ ...editing, service_type: e.target.value })} placeholder="e.g. Wedding Photography" className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Review *</label>
                <textarea required value={editing.quote} onChange={e => setEditing({ ...editing, quote: e.target.value })} rows={4} className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors resize-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setEditing({ ...editing, rating: n })} className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${editing.rating >= n ? 'bg-[#C9A86C] border-[#C9A86C] text-[#1A1A1A]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400 bg-white shadow-sm'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="t-active" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 accent-[#C9A86C]" />
                <label htmlFor="t-active" className="text-sm text-neutral-600">Active (shown on website)</label>
              </div>
              {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60 shadow-md">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Review'}
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
