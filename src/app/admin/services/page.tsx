'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import MediaUpload from '@/components/admin/MediaUpload';
import { Plus, Trash2, Loader2, Save, X, ChevronRight, Images, Tag, ArrowLeft } from 'lucide-react';

interface ServicePackage { id?: string; service_id?: string; package_name: string; price: string; features: string[]; display_order: number; }
interface GalleryImage { id?: string; service_id?: string; image_url: string; alt_text: string; display_order: number; }
interface Service { id?: string; title: string; slug: string; short_description: string; full_description: string; hero_image_url: string; is_active: boolean; display_order: number; seo_title: string; seo_description: string; }

const EMPTY_SERVICE: Service = { title: '', slug: '', short_description: '', full_description: '', hero_image_url: '', is_active: true, display_order: 0, seo_title: '', seo_description: '' };

type View = 'list' | 'edit-service' | 'manage-gallery' | 'manage-packages';

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [selected, setSelected] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState<Service>({ ...EMPTY_SERVICE });
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadServices = useCallback(async () => {
    const { data } = await createClient().from('services').select('*').order('display_order');
    setServices(data || []);
    setLoading(false);
  }, []);

  const loadServiceDetails = useCallback(async (svc: Service) => {
    const sb = createClient();
    const [{ data: gal }, { data: pkgs }] = await Promise.all([
      sb.from('service_gallery').select('*').eq('service_id', svc.id!).order('display_order'),
      sb.from('service_packages').select('*').eq('service_id', svc.id!).order('display_order'),
    ]);
    setGallery(gal || []);
    setPackages(pkgs || []);
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  const openEdit = (svc: Service) => { setSelected(svc); setEditForm(svc); setView('edit-service'); };
  const openNew = () => { setSelected(null); setEditForm({ ...EMPTY_SERVICE, display_order: services.length + 1 }); setView('edit-service'); };

  const openGallery = async (svc: Service) => { setSelected(svc); await loadServiceDetails(svc); setView('manage-gallery'); };
  const openPackages = async (svc: Service) => { setSelected(svc); await loadServiceDetails(svc); setView('manage-packages'); };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setEditForm(f => ({ ...f, title, slug: f.id ? f.slug : slug }));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    const sb = createClient();
    const { error: err } = editForm.id
      ? await sb.from('services').update({ ...editForm, updated_at: new Date().toISOString() }).eq('id', editForm.id)
      : await sb.from('services').insert(editForm);
    if (err) setError(err.message);
    else { setView('list'); loadServices(); }
    setSaving(false);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service and all its gallery photos and packages?')) return;
    await createClient().from('services').delete().eq('id', id);
    loadServices();
  };

  // Gallery management
  const addGalleryImage = async (imageUrl: string) => {
    if (!selected?.id || !imageUrl) return;
    const sb = createClient();
    const { data } = await sb.from('service_gallery').insert({ service_id: selected.id, image_url: imageUrl, alt_text: '', display_order: gallery.length + 1 }).select().single();
    if (data) setGallery(g => [...g, data]);
  };

  const removeGalleryImage = async (id: string) => {
    await createClient().from('service_gallery').delete().eq('id', id);
    setGallery(g => g.filter(img => img.id !== id));
  };

  // Package management
  const savePackage = async (pkg: ServicePackage) => {
    const sb = createClient();
    if (pkg.id) {
      await sb.from('service_packages').update(pkg).eq('id', pkg.id);
    } else {
      const { data } = await sb.from('service_packages').insert({ ...pkg, service_id: selected?.id }).select().single();
      if (data) setPackages(p => [...p, data]);
      return;
    }
    setPackages(p => p.map(x => x.id === pkg.id ? pkg : x));
  };

  const removePackage = async (id: string) => {
    await createClient().from('service_packages').delete().eq('id', id);
    setPackages(p => p.filter(x => x.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  // ── LIST VIEW ──────────────────────────────────────────────────────
  if (view === 'list') return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white font-light tracking-wide">Services</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage photography service categories</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      <div className="space-y-3">
        {services.map((svc) => (
          <div key={svc.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 flex items-center gap-4">
            {svc.hero_image_url && <img src={svc.hero_image_url} alt={svc.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{svc.title}</p>
              <p className="text-neutral-500 text-xs mt-0.5 truncate">{svc.short_description}</p>
              <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full mt-1.5 ${svc.is_active ? 'bg-green-900/50 text-green-400' : 'bg-neutral-800 text-neutral-500'}`}>{svc.is_active ? 'Active' : 'Hidden'}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openGallery(svc)} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-3 py-1.5 rounded-lg transition-all">
                <Images className="w-3.5 h-3.5" /> Gallery
              </button>
              <button onClick={() => openPackages(svc)} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-3 py-1.5 rounded-lg transition-all">
                <Tag className="w-3.5 h-3.5" /> Packages
              </button>
              <button onClick={() => openEdit(svc)} className="text-xs text-[#C9A86C] border border-[#C9A86C]/30 px-3 py-1.5 rounded-lg hover:border-[#C9A86C] transition-all">Edit</button>
              <button onClick={() => handleDeleteService(svc.id!)} className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── EDIT SERVICE VIEW ──────────────────────────────────────────────
  if (view === 'edit-service') return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => setView('list')} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </button>
      <h1 className="text-2xl font-serif text-white font-light tracking-wide mb-8">{editForm.id ? 'Edit' : 'New'} Service</h1>
      <form onSubmit={handleSaveService} className="space-y-5">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Service Title *</label>
            <input required value={editForm.title} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">URL Slug *</label>
            <input required value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors font-mono" />
            <p className="text-neutral-600 text-[10px] mt-1">URL: /services/{editForm.slug || 'your-service-name'}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Short Description</label>
            <textarea value={editForm.short_description} onChange={e => setEditForm(f => ({ ...f, short_description: e.target.value }))} rows={2} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Full Description</label>
            <textarea value={editForm.full_description} onChange={e => setEditForm(f => ({ ...f, full_description: e.target.value }))} rows={5} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" />
          </div>
          <MediaUpload type="image" folder="services" currentUrl={editForm.hero_image_url} onUpload={url => setEditForm(f => ({ ...f, hero_image_url: url }))} label="Hero Image" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Display Order</label>
              <input type="number" value={editForm.display_order} onChange={e => setEditForm(f => ({ ...f, display_order: +e.target.value }))} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
            </div>
            <div className="flex items-end pb-1">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="svc-active" checked={editForm.is_active} onChange={e => setEditForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-[#C9A86C]" />
                <label htmlFor="svc-active" className="text-sm text-neutral-300">Active service</label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">SEO</h2>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">SEO Title (optional)</label>
            <input value={editForm.seo_title} onChange={e => setEditForm(f => ({ ...f, seo_title: e.target.value }))} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">SEO Description (optional)</label>
            <textarea value={editForm.seo_description} onChange={e => setEditForm(f => ({ ...f, seo_description: e.target.value }))} rows={2} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors resize-none" />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-8 py-3 rounded-lg transition-all disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Service'}
          </button>
          <button type="button" onClick={() => setView('list')} className="text-neutral-400 hover:text-white border border-neutral-700 px-8 py-3 rounded-lg text-sm transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );

  // ── GALLERY VIEW ──────────────────────────────────────────────────
  if (view === 'manage-gallery') return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => setView('list')} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </button>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white font-light tracking-wide">{selected?.title}</h1>
          <p className="text-neutral-500 text-sm mt-1">Gallery — {gallery.length} photos</p>
        </div>
      </div>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-6">
        <MediaUpload type="image" folder={`services/${selected?.slug}`} onUpload={url => addGalleryImage(url)} label="Add Gallery Photo" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {gallery.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
            <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
            <button onClick={() => removeGalleryImage(img.id!)} className="absolute top-2 right-2 w-7 h-7 bg-red-600/90 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {gallery.length === 0 && <div className="col-span-4 text-center py-12 text-neutral-600">No gallery photos yet. Upload above.</div>}
      </div>
    </div>
  );

  // ── PACKAGES VIEW ─────────────────────────────────────────────────
  if (view === 'manage-packages') return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => setView('list')} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </button>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white font-light tracking-wide">{selected?.title}</h1>
          <p className="text-neutral-500 text-sm mt-1">Pricing Packages — {packages.length} packages</p>
        </div>
        <button onClick={() => setPackages(p => [...p, { package_name: '', price: '', features: [''], display_order: p.length + 1 }])} className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>
      <div className="space-y-4">
        {packages.map((pkg, idx) => (
          <div key={pkg.id || idx} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Package Name</label>
                <input value={pkg.package_name} onChange={e => { const p = [...packages]; p[idx] = { ...p[idx], package_name: e.target.value }; setPackages(p); }} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Price</label>
                <input value={pkg.price} placeholder="e.g. ₹25,000" onChange={e => { const p = [...packages]; p[idx] = { ...p[idx], price: e.target.value }; setPackages(p); }} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Features (one per line)</label>
              <textarea value={pkg.features.join('\n')} onChange={e => { const p = [...packages]; p[idx] = { ...p[idx], features: e.target.value.split('\n') }; setPackages(p); }} rows={4} placeholder="4 Hours Coverage&#10;500 Edited Photos&#10;Online Gallery" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A86C] transition-colors resize-none font-mono" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => savePackage(pkg)} className="flex items-center gap-2 bg-[#C9A86C]/20 hover:bg-[#C9A86C] text-[#C9A86C] hover:text-[#1A1A1A] text-xs font-semibold px-4 py-2 rounded-lg transition-all border border-[#C9A86C]/30">
                <Save className="w-3.5 h-3.5" /> Save Package
              </button>
              {pkg.id && (
                <button type="button" onClick={() => removePackage(pkg.id!)} className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs px-4 py-2 rounded-lg hover:bg-red-950/40 transition-all border border-red-900/40">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {packages.length === 0 && <div className="text-center py-12 text-neutral-600 border border-dashed border-neutral-700 rounded-xl">No packages yet.</div>}
      </div>
    </div>
  );

  return null;
}
