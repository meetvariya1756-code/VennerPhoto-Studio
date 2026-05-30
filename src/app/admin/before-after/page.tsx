'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import MediaUpload from '@/components/admin/MediaUpload';
import { Plus, Trash2, Loader2, Save, X, Columns } from 'lucide-react';

interface BeforeAfterComparison {
  id?: string;
  title: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  is_active: boolean;
  display_order: number;
}

const EMPTY_COMPARISON: BeforeAfterComparison = {
  title: '',
  description: '',
  before_image_url: '',
  after_image_url: '',
  is_active: true,
  display_order: 0,
};

export default function BeforeAfterAdminPage() {
  const [comparisons, setComparisons] = useState<BeforeAfterComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BeforeAfterComparison | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const sb = createClient();
    const { data } = await sb
      .from('before_after_comparisons')
      .select('*')
      .order('display_order');
    setComparisons(data || []);
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
    
    const { error: err } = editing.id
      ? await sb
          .from('before_after_comparisons')
          .update({ ...editing, updated_at: new Date().toISOString() })
          .eq('id', editing.id)
      : await sb.from('before_after_comparisons').insert({ ...editing });

    if (err) {
      setError(err.message);
    } else {
      setEditing(null);
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this before/after comparison slider?')) return;
    const sb = createClient();
    await sb.from('before_after_comparisons').delete().eq('id', id);
    load();
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
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Before & After Showcase</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage Raw vs Retouched slider comparisons on the homepage</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY_COMPARISON, display_order: comparisons.length + 1 })}
          className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Slider
        </button>
      </div>

      {/* Comparisons Grid List */}
      <div className="space-y-4">
        {comparisons.length === 0 && (
          <div className="text-center py-16 text-neutral-400 border border-dashed border-neutral-300 rounded-xl bg-white shadow-sm">
            No comparisons yet. Click "Add Slider" to create one.
          </div>
        )}
        {comparisons.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden flex flex-col sm:flex-row sm:items-center gap-4 p-4 group shadow-sm"
          >
            {/* Visual Double Previews */}
            <div className="flex gap-2 shrink-0">
              {item.before_image_url && (
                <div className="relative">
                  <img
                    src={item.before_image_url}
                    alt="Raw"
                    className="w-16 h-12 object-cover rounded-lg border border-neutral-200"
                  />
                  <span className="absolute bottom-0.5 left-1 bg-black/60 text-white text-[7px] px-1 rounded font-sans font-semibold uppercase">Raw</span>
                </div>
              )}
              {item.after_image_url && (
                <div className="relative">
                  <img
                    src={item.after_image_url}
                    alt="Retouched"
                    className="w-16 h-12 object-cover rounded-lg border border-neutral-200"
                  />
                  <span className="absolute bottom-0.5 left-1 bg-black/60 text-white text-[7px] px-1 rounded font-sans font-semibold uppercase">Edit</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A1A] font-semibold text-sm truncate">{item.title}</p>
              <p className="text-neutral-400 text-xs truncate mt-0.5">{item.description || 'No description provided'}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    item.is_active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                  }`}
                >
                  {item.is_active ? 'Active' : 'Hidden'}
                </span>
                <span className="text-[10px] text-neutral-400">Order: {item.display_order}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto mt-2 sm:mt-0">
              <button
                onClick={() => setEditing(item)}
                className="text-xs text-[#C9A86C] hover:bg-neutral-900 hover:text-white border border-[#C9A86C]/40 px-3 py-1.5 rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id!)}
                className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/New Slider Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-[#1A1A1A] font-semibold">{editing.id ? 'Edit' : 'New'} Before/After Slider</h2>
              <button
                onClick={() => setEditing(null)}
                className="text-neutral-400 hover:text-[#1A1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Comparison Title *
                </label>
                <input
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Wedding Portrait Skin & Light recovery"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Describe the adjustments (e.g., highlights recovery, color grading, skin retouching)"
                  rows={2}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors resize-none shadow-sm"
                />
              </div>

              {/* Side by side image uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MediaUpload
                  type="image"
                  folder="before-after"
                  currentUrl={editing.before_image_url}
                  onUpload={(url) => setEditing({ ...editing, before_image_url: url })}
                  label="Before Image (Original / Raw) *"
                />
                <MediaUpload
                  type="image"
                  folder="before-after"
                  currentUrl={editing.after_image_url}
                  onUpload={(url) => setEditing({ ...editing, after_image_url: url })}
                  label="After Image (Retouched / Edited) *"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-end pb-1.5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="comp-active"
                      checked={editing.is_active}
                      onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A86C]"
                    />
                    <label htmlFor="comp-active" className="text-sm text-neutral-600">
                      Active (visible on website)
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-60 shadow-md"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Slider'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="text-neutral-500 hover:text-neutral-700 border border-neutral-300 hover:bg-neutral-50 px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
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
