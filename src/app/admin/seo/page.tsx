'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe, Plus, Trash2, Save, CheckCircle, Loader2,
  ExternalLink, Search, RefreshCw, FileText, Check, AlertCircle
} from 'lucide-react';
import MediaUpload from '@/components/admin/MediaUpload';
import { triggerRevalidation } from '@/lib/revalidate';
import type { SeoSettings, FooterKeyword } from '@/types';

const SUGGESTED_KEYWORDS: FooterKeyword[] = [
  { keyword: 'Best Wedding Photographer in Surat', url: '/services/wedding-photography' },
  { keyword: 'Luxury Pre-Wedding Shoot Surat', url: '/services/engagement-photography' },
  { keyword: 'Cinematic Wedding Highlights & Films', url: '/reels' },
  { keyword: 'Indoor Photo Studio Katargam Surat', url: '/services/indoor-studio-photography' },
  { keyword: 'Born Baby & Newborn Photography Surat', url: '/services/born-baby' },
  { keyword: 'Baby Shower & Maternity Shoots', url: '/services/baby-shower-photography' },
  { keyword: 'Fashion & Modeling Portfolio Shoots', url: '/services/modeling-photography' },
  { keyword: 'Toddler & Kids Portrait Photography', url: '/services/toddler-children' },
  { keyword: 'Commercial & Product Photography', url: '/services/product-photography' },
  { keyword: 'Candid Destination Wedding Shoots', url: '/portfolio' },
  { keyword: 'Professional Photographers in Surat', url: '/team' },
  { keyword: 'Studio Journal & Wedding Guides', url: '/blog' }
];

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<SeoSettings>({
    id: 'default',
    site_title: 'Venner Photo Studio | Luxury Wedding & Portrait Photography in Surat',
    meta_description: "Surat's premier high-end photography studio specializing in luxury weddings, cinematic reels, editorial portraits, baby shoots, and commercial brand storytelling.",
    default_keywords: 'wedding photographer surat, best photo studio surat, luxury wedding photography, pre wedding shoot surat, baby photoshoot surat, maternity photographer, modeling portfolio surat',
    footer_keywords: SUGGESTED_KEYWORDS,
    google_site_verification: '',
    og_image_url: '/logo.png',
    canonical_url: 'https://vennerphotostudio.com',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // New Keyword input
  const [newKeywordText, setNewKeywordText] = useState('');
  const [newKeywordUrl, setNewKeywordUrl] = useState('/services');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/seo_settings?limit=1');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const loaded = data[0];
          setSettings({
            ...loaded,
            footer_keywords: Array.isArray(loaded.footer_keywords)
              ? loaded.footer_keywords.map((k: any) =>
                  typeof k === 'string' ? { keyword: k, url: '/services' } : k
                )
              : SUGGESTED_KEYWORDS,
          });
        }
      } catch (err) {
        console.error('Failed to load SEO settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordText.trim()) return;

    const newKw: FooterKeyword = {
      keyword: newKeywordText.trim(),
      url: newKeywordUrl.trim() || '/services',
    };

    setSettings((prev) => ({
      ...prev,
      footer_keywords: [...(prev.footer_keywords || []), newKw],
    }));

    setNewKeywordText('');
    setNewKeywordUrl('/services');
  };

  const handleRemoveKeyword = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      footer_keywords: prev.footer_keywords.filter((_, i) => i !== index),
    }));
  };

  const handleAddAllSuggested = () => {
    const currentKeywords = new Set(settings.footer_keywords.map((k) => k.keyword.toLowerCase()));
    const missing = SUGGESTED_KEYWORDS.filter(
      (k) => !currentKeywords.has(k.keyword.toLowerCase())
    );
    if (missing.length > 0) {
      setSettings((prev) => ({
        ...prev,
        footer_keywords: [...prev.footer_keywords, ...missing],
      }));
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/seo_settings?id=${settings.id || 'default'}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          id: settings.id || 'default',
          updated_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save SEO settings');
      }

      setSaved(true);
      triggerRevalidation();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">
            SEO & Footer Keywords Management
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Manage search engine rankings, footer SEO keywords, meta tags, and sitemaps.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] font-semibold text-sm px-6 py-2.5 rounded-lg transition-all shadow-md disabled:opacity-60 shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: Manageable Footer SEO Keywords */}
      <div className="bg-white border border-neutral-200/60 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/60 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#C9A86C]" />
              Manageable Footer SEO Keywords
            </h2>
            <p className="text-neutral-400 text-xs mt-0.5">
              These keywords display in the website footer with internal links to elevate search engine rankings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddAllSuggested}
            className="text-xs text-[#8C6D39] hover:text-[#C9A86C] font-semibold flex items-center gap-1.5 self-start sm:self-auto bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Recommended Keywords
          </button>
        </div>

        {/* Add Keyword Form */}
        <form onSubmit={handleAddKeyword} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Keyword (e.g. Best Wedding Photographer in Surat)"
              value={newKeywordText}
              onChange={(e) => setNewKeywordText(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#C9A86C]"
            />
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Target URL (e.g. /services/wedding-photography)"
              value={newKeywordUrl}
              onChange={(e) => setNewKeywordUrl(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#C9A86C]"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-[#1A1A1A] hover:bg-[#C9A86C] hover:text-[#1A1A1A] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Keyword
          </button>
        </form>

        {/* Keyword Tags List */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Active Footer Keywords ({settings.footer_keywords.length})
          </label>
          {settings.footer_keywords.length === 0 ? (
            <p className="text-neutral-400 text-xs italic">No footer keywords added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {settings.footer_keywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="group bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-[#C9A86C]/40 rounded-lg pl-3 pr-2 py-1.5 flex items-center gap-2 text-xs transition-all shadow-2xs"
                >
                  <span className="font-medium text-[#1A1A1A]">{kw.keyword}</span>
                  {kw.url && (
                    <span className="text-[10px] text-neutral-400 font-mono bg-neutral-200/60 px-1.5 py-0.5 rounded">
                      {kw.url}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(idx)}
                    className="text-neutral-400 hover:text-red-600 p-0.5 rounded"
                    title="Remove keyword"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Global Search Engine Optimization (Meta & Verification) */}
      <div className="bg-white border border-neutral-200/60 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider border-b border-neutral-200/60 pb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#C9A86C]" />
          Global On-Page SEO Defaults
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
              Default Meta Title
            </label>
            <input
              type="text"
              value={settings.site_title || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, site_title: e.target.value }))}
              placeholder="e.g. Venner Photo Studio | Luxury Wedding & Portrait Photography"
              className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={settings.meta_description || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, meta_description: e.target.value }))}
              placeholder="Description shown on Google search snippet..."
              className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                Default Target Keywords
              </label>
              <input
                type="text"
                value={settings.default_keywords || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, default_keywords: e.target.value }))}
                placeholder="wedding photographer, surat photo studio, candid portrait"
                className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                Google Search Console Verification Code
              </label>
              <input
                type="text"
                value={settings.google_site_verification || ''}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, google_site_verification: e.target.value }))
                }
                placeholder="Paste code from Google Search Console (e.g. google123abc456)"
                className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
              Default Social Media Share Image (Open Graph / Twitter)
            </label>
            <MediaUpload
              type="image"
              currentUrl={settings.og_image_url}
              onUpload={(url) => setSettings((prev) => ({ ...prev, og_image_url: url }))}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: XML Sitemap & Search Engine Crawlers */}
      <div className="bg-white border border-neutral-200/60 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider border-b border-neutral-200/60 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#C9A86C]" />
          XML Sitemap & Search Crawler Integration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sitemap card */}
          <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-[#1A1A1A] uppercase tracking-wider">
                XML Sitemap (/sitemap.xml)
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Live & Dynamic
              </span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed mb-4">
              Automatically updates whenever services or new blog posts are published.
            </p>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#8C6D39] hover:text-[#C9A86C] font-semibold"
            >
              <span>View XML Sitemap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Robots.txt card */}
          <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-[#1A1A1A] uppercase tracking-wider">
                Robots File (/robots.txt)
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Active
              </span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed mb-4">
              Directs Google and Bing crawlers to index public pages and points to the sitemap.
            </p>
            <Link
              href="/robots.txt"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#8C6D39] hover:text-[#C9A86C] font-semibold"
            >
              <span>View robots.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

