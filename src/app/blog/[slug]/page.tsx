import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Share2, Tag, ChevronRight, User, Check, Facebook } from 'lucide-react';
import { getBlogBySlug, getBlogs } from '@/lib/db';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import BlogShareButtons from '@/components/blog/BlogShareButtons';

export const revalidate = 60;

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const blogs = await getBlogs(true);
  return blogs.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Story Not Found | Venner Photo Studio',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vennerphotostudio.com';
  const fullUrl = `${siteUrl}/blog/${slug}`;
  const title = blog.meta_title || `${blog.title} | Venner Photo Studio`;
  const description = blog.meta_description || blog.excerpt;
  const image = blog.featured_image_url || `${siteUrl}/logo.png`;

  return {
    title,
    description,
    keywords: blog.seo_keywords || undefined,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Venner Photo Studio',
      type: 'article',
      publishedTime: blog.published_at || blog.created_at,
      authors: [blog.author || 'Venner Photo Studio'],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || (!blog.is_published && process.env.NODE_ENV === 'production')) {
    notFound();
  }

  // Get other stories for recommendation
  const allBlogs = await getBlogs(true);
  const relatedBlogs = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vennerphotostudio.com';
  const fullUrl = `${siteUrl}/blog/${slug}`;

  // Structured Data Schema for BlogPosting and BreadcrumbList
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    'headline': blog.title,
    'description': blog.excerpt,
    'image': [blog.featured_image_url || `${siteUrl}/logo.png`],
    'datePublished': blog.published_at || blog.created_at,
    'dateModified': blog.updated_at || blog.published_at || blog.created_at,
    'author': {
      '@type': 'Organization',
      'name': blog.author || 'Venner Photo Studio',
      'url': siteUrl,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Venner Photo Studio',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`,
      },
    },
    'keywords': blog.seo_keywords,
    'articleSection': blog.category || 'Photography',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Journal',
        'item': `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': blog.title,
        'item': fullUrl,
      },
    ],
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Render article content safely with paragraphs and headings
  const renderFormattedContent = (content: string) => {
    const blocks = content.split('\n\n');
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-2xl font-medium text-[#1A1A1A] mt-8 mb-4 tracking-wide">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="font-sans text-sm uppercase tracking-wider font-semibold text-[#8C6D39] mt-6 mb-3">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter(Boolean);
        return (
          <ul key={idx} className="list-disc pl-6 space-y-2 text-neutral-700 my-4 text-base leading-relaxed">
            {items.map((item, iIdx) => (
              <li key={iIdx}>
                {item.replace(/^- /, '')}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-neutral-700 text-base md:text-lg leading-relaxed mb-6 font-light">
          {trimmed}
        </p>
      );
    });
  };

  const keywordsList = blog.seo_keywords
    ? blog.seo_keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  return (
    <article className="min-h-screen bg-[#F9F7F4] pt-28 pb-20">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostingSchema, breadcrumbSchema]),
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-neutral-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#C9A86C] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/blog" className="hover:text-[#C9A86C] transition-colors">
            Journal
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[#1A1A1A] font-medium truncate max-w-xs sm:max-w-md">
            {blog.title}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-neutral-500 hover:text-[#C9A86C] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>

        {/* Category & Metadata Header */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-neutral-400 mb-4">
          <span className="bg-[#1A1A1A] text-[#C9A86C] uppercase tracking-widest text-[10px] font-semibold px-3 py-1 rounded-full">
            {blog.category || 'Story'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={blog.published_at || blog.created_at}>
              {formatDate(blog.published_at || blog.created_at || '')}
            </time>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {blog.reading_time || '5 min read'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-neutral-600">
            <User className="w-3.5 h-3.5" />
            {blog.author || 'Venner Photo Studio'}
          </span>
        </div>

        {/* Article H1 Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight tracking-wide mb-6">
          {blog.title}
        </h1>

        {/* Subtitle / Excerpt */}
        {blog.excerpt && (
          <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed mb-8 border-l-2 border-[#C9A86C] pl-4 italic">
            {blog.excerpt}
          </p>
        )}

        {/* Featured Banner Image */}
        {blog.featured_image_url && (
          <div className="relative w-full h-80 sm:h-[450px] md:h-[520px] rounded-2xl overflow-hidden bg-neutral-900 shadow-md mb-12">
            <ImageWithFallback
              src={blog.featured_image_url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-neutral-200/80 shadow-sm mb-12">
          {renderFormattedContent(blog.content)}

          {/* Tags Section */}
          {keywordsList.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-100">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#C9A86C]" />
                <span className="text-xs font-sans uppercase tracking-wider text-neutral-400 font-semibold">
                  Related Topics & Search Keywords
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywordsList.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-neutral-100 text-neutral-700 text-xs px-3 py-1 rounded-full font-sans hover:bg-[#C9A86C]/10 hover:text-[#8C6D39] transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Share Component */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-sans uppercase tracking-wider text-neutral-500 font-semibold">
                Share this article
              </span>
            </div>
            <BlogShareButtons url={fullUrl} title={blog.title} />
          </div>
        </div>

        {/* Booking Consultation Card */}
        <div className="bg-[#1A1A1A] text-white rounded-2xl p-8 md:p-10 mb-16 border border-neutral-800 text-center">
          <span className="text-[10px] text-[#C9A86C] uppercase tracking-[0.25em] font-sans font-semibold block mb-2">
            Bespoke Photography in Surat
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-light mb-3">
            Inspired by this story?
          </h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
            Let us craft your personalized photography session. Speak with our lead photographers today.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#C9A86C] hover:bg-[#E5C483] text-[#1A1A1A] text-xs font-sans tracking-widest uppercase font-semibold px-8 py-3.5 transition-all shadow-md"
          >
            Schedule Consultation
          </Link>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div>
            <h3 className="font-serif text-2xl text-[#1A1A1A] font-medium mb-6">
              More Stories from the Journal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-neutral-200/80 hover:border-[#C9A86C]/40 shadow-sm transition-all"
                >
                  <div className="relative h-40 overflow-hidden bg-neutral-900">
                    <ImageWithFallback
                      src={rel.featured_image_url || '/uploads/1788853159647_VAPW4871.jpg'}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[9px] uppercase tracking-wider text-[#C9A86C] font-semibold font-sans">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-sm font-medium text-[#1A1A1A] group-hover:text-[#8C6D39] transition-colors line-clamp-2 mt-1">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

