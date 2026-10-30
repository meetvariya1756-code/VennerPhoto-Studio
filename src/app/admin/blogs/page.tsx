'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Plus, Search, Edit2, Trash2, Eye, EyeOff,
  CheckCircle, Loader2, X, ExternalLink, Calendar, Clock, Image as ImageIcon
} from 'lucide-react';
import MediaUpload from '@/components/admin/MediaUpload';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { triggerRevalidation } from '@/lib/revalidate';
import type { BlogPost } from '@/types';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const EMPTY_FORM: Partial<BlogPost> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image_url: '',
  category: 'Wedding',
  author: 'Venner Photo Studio',
  meta_title: '',
  meta_description: '',
  seo_keywords: '',
  is_published: true,
  reading_time: '5 min read',
};

const CATEGORIES = [
  'Wedding',
  'Pre-Wedding',
  'Portrait',
  'Maternity',
  'Born Baby',
  'Fashion',
  'Tips & Guides',
  'Studio News'
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blogs?order=created_at.desc&limit=100');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...EMPTY_FORM,
      published_at: new Date().toISOString(),
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setFormData({ ...blog });
    setError('');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.id ? prev.slug : slugify(val),
      meta_title: prev.meta_title ? prev.meta_title : `${val} | Venner Photo Studio`,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      setError('Please fill in title, slug, and article content.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = editingId ? `/api/admin/blogs?id=${editingId}` : '/api/admin/blogs';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        slug: slugify(formData.slug || formData.title || ''),
        updated_at: new Date().toISOString(),
        published_at: formData.published_at || new Date().toISOString(),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save blog post');
      }

      setIsModalOpen(false);
      await loadBlogs();
      triggerRevalidation();
    } catch (err: any) {
      setError(err.message || 'Error saving blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        triggerRevalidation();
      }
    } catch (err) {
      console.error('Failed to delete blog post:', err);
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    const nextStatus = !blog.is_published;
    try {
      const res = await fetch(`/api/admin/blogs?id=${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: nextStatus }),
      });
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, is_published: nextStatus } : b))
        );
        triggerRevalidation();
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase()) ||
      (b.category && b.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A] font-medium tracking-wide">
            Blog Posts & SEO Articles
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Create and publish SEO-optimized articles to boost search engine rankings and organic traffic.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A86C] hover:text-[#1A1A1A] text-white px-5 py-2.5 rounded-lg text-sm font-sans font-medium transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/60 rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles by title, slug or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-10 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#C9A86C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['All', ...CATEGORIES.slice(0, 5)].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#1A1A1A] text-[#C9A86C] font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white border border-neutral-200/60 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 text-[#C9A86C] animate-spin" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-serif text-[#1A1A1A] font-medium">No blog posts found</h3>
            <p className="text-neutral-400 text-xs mt-1 mb-4">
              Get started by publishing your first article for SEO.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-[#C9A86C] text-[#1A1A1A] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#E5C483] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write First Article
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200/60 bg-neutral-50/60 text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Views</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm font-sans">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Title & Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0">
                          {blog.featured_image_url ? (
                            <ImageWithFallback
                              src={blog.featured_image_url}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#1A1A1A] truncate max-w-xs md:max-w-md">
                            {blog.title}
                          </p>
                          <div className="flex items-center gap-2 text-neutral-400 text-xs">
                            <span className="truncate max-w-[200px]">/blog/{blog.slug}</span>
                            <Link
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              className="text-neutral-400 hover:text-[#C9A86C]"
                              title="View on site"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                        {blog.category || 'General'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          blog.is_published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            blog.is_published ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>{blog.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-neutral-700">
                        {blog.views || 0}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-neutral-500 text-xs whitespace-nowrap">
                      {new Date(blog.published_at || blog.created_at || '').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(blog)}
                          className="p-1.5 text-neutral-400 hover:text-[#1A1A1A] hover:bg-neutral-100 rounded transition-colors"
                          title="Edit article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-serif font-medium text-[#1A1A1A]">
                {editingId ? 'Edit Article' : 'Write New Article'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-[#1A1A1A] p-1 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3">
                  {error}
                </div>
              )}

              {/* Title & Slug */}
              <div className="space-y-4 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200/60">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Top 10 Pre-Wedding Shoot Locations in Surat"
                    value={formData.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      URL Slug * (SEO-friendly)
                    </label>
                    <div className="flex items-center">
                      <span className="bg-neutral-100 border border-r-0 border-neutral-300 px-3 py-2.5 text-xs text-neutral-500 rounded-l-lg">
                        /blog/
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="top-10-pre-wedding-shoot-locations-surat"
                        value={formData.slug || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                        }
                        className="flex-1 bg-white border border-neutral-300 rounded-r-lg px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={formData.category || 'Wedding'}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Featured Media */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                  Featured Cover Image
                </label>
                <MediaUpload
                  type="image"
                  currentUrl={formData.featured_image_url}
                  onUpload={(url) => setFormData((prev) => ({ ...prev, featured_image_url: url }))}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                  Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise 1-2 sentence overview shown in blog cards and search results..."
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                />
              </div>

              {/* Article Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                    Article Full Content *
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Use ### for Subheadings, - for Bullets, and double enters for Paragraphs
                  </span>
                </div>
                <textarea
                  required
                  rows={12}
                  placeholder="Write your article here..."
                  value={formData.content || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-4 font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C] leading-relaxed"
                />
              </div>

              {/* SEO Fields Section */}
              <div className="bg-neutral-50/70 p-5 rounded-xl border border-neutral-200/80 space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Search Engine Optimization (SEO) Settings
                  </span>
                  <span className="text-[10px] text-[#C9A86C] bg-[#C9A86C]/10 px-2 py-0.5 rounded font-medium">
                    Google Ranking Booster
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                      Meta Title (Browser Tab & Google Title)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Best Wedding Photography in Surat | Venner Studio"
                      value={formData.meta_title || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                      SEO Keywords (Comma Separated)
                    </label>
                    <input
                      type="text"
                      placeholder="wedding photographer surat, pre wedding shoot, bridal portrait"
                      value={formData.seo_keywords || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, seo_keywords: e.target.value }))}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                    Meta Description (Google Snippet)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter meta description up to 160 characters for search engines..."
                    value={formData.meta_description || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                  />
                </div>
              </div>

              {/* Status and Publishing Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author || 'Venner Photo Studio'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={formData.reading_time || '5 min read'}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reading_time: e.target.value }))}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C9A86C]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published ?? true}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 text-[#C9A86C] rounded border-neutral-300 focus:ring-[#C9A86C]"
                  />
                  <label htmlFor="is_published" className="text-xs font-medium text-[#1A1A1A] cursor-pointer">
                    Publish immediately to website
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-500 hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] px-6 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-md disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

