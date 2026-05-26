'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Save, Loader2, CheckCircle } from 'lucide-react';

interface Settings {
  id?: string;
  studio_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  sunday_hours: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  whatsapp_number: string;
  google_map_embed_url: string;
}

const DEFAULTS: Settings = {
  studio_name: 'Venner Photo Studio',
  tagline: 'Capturing Timeless Moments with Cinematic Elegance',
  phone: '+91 98259 83437',
  email: 'vennerphoto@gmail.com',
  address: 'B-27 Rangdarshan So-1, Dhanmora, Katargam, Surat',
  working_hours: 'Mon - Sat: 9:00 AM - 8:00 PM',
  sunday_hours: 'Available By Appointment Only',
  instagram_url: 'https://www.instagram.com/vennerphoto?igsh=cW53NnFuNjduanVj',
  facebook_url: 'https://www.facebook.com/share/18frTUd7PD/',
  youtube_url: 'https://m.youtube.com/@vennerphoto',
  whatsapp_number: '919825983437',
  google_map_embed_url: '',
};

function Field({ label, name, value, onChange, type = 'text', placeholder = '' }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">{label}</label>
      {name === 'google_map_embed_url' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors resize-none shadow-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#C9A86C] focus:ring-1 focus:ring-[#C9A86C]/30 transition-colors shadow-sm"
        />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const sb = createClient();
      const { data } = await sb.from('site_settings').select('*').limit(1).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const sb = createClient();
    const { error: err } = settings.id
      ? await sb.from('site_settings').update({ ...settings, updated_at: new Date().toISOString() }).eq('id', settings.id)
      : await sb.from('site_settings').insert(settings);
    if (err) setError(err.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">Site Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Edit your studio's global information</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Studio Info */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider border-b border-neutral-200/60 pb-3">Studio Information</h2>
          <Field label="Studio Name" name="studio_name" value={settings.studio_name} onChange={handleChange} />
          <Field label="Tagline" name="tagline" value={settings.tagline} onChange={handleChange} />
          <Field label="Address" name="address" value={settings.address} onChange={handleChange} />
        </div>

        {/* Contact */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider border-b border-neutral-200/60 pb-3">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Phone" name="phone" value={settings.phone} onChange={handleChange} type="tel" />
            <Field label="WhatsApp Number (with country code)" name="whatsapp_number" value={settings.whatsapp_number} onChange={handleChange} placeholder="919825983437" />
          </div>
          <Field label="Email" name="email" value={settings.email} onChange={handleChange} type="email" />
        </div>

        {/* Hours */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider border-b border-neutral-200/60 pb-3">Working Hours</h2>
          <Field label="Mon - Sat Hours" name="working_hours" value={settings.working_hours} onChange={handleChange} />
          <Field label="Sunday Hours" name="sunday_hours" value={settings.sunday_hours} onChange={handleChange} />
        </div>

        {/* Social Links */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider border-b border-neutral-200/60 pb-3">Social Media Links</h2>
          <Field label="Instagram URL" name="instagram_url" value={settings.instagram_url} onChange={handleChange} type="url" />
          <Field label="Facebook URL" name="facebook_url" value={settings.facebook_url} onChange={handleChange} type="url" />
          <Field label="YouTube URL" name="youtube_url" value={settings.youtube_url} onChange={handleChange} type="url" />
        </div>

        {/* Map */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider border-b border-neutral-200/60 pb-3">Google Maps</h2>
          <Field label="Google Maps Embed URL (from Google Maps → Share → Embed)" name="google_map_embed_url" value={settings.google_map_embed_url} onChange={handleChange} />
        </div>

        {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-8 py-3 rounded-lg transition-all disabled:opacity-60 shadow-md"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
