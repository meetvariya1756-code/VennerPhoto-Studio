'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn, getMockPlaceholder } from '@/lib/utils';
import { urlForImage } from '@/lib/sanity.image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: any; // Sanity Image object or local string url
  fallbackType?: 'photo' | 'avatar' | 'video-thumb' | 'logo' | 'hero';
  fallbackIndex?: number;
}

export default function ImageWithFallback({
  src,
  fallbackType = 'photo',
  fallbackIndex = 0,
  alt = 'Venner Photography Asset',
  className,
  ...props
}: ImageWithFallbackProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Resolve source URL
  let resolvedSrc = '';

  if (error || !src) {
    resolvedSrc = getMockPlaceholder(fallbackType, fallbackIndex);
  } else if (typeof src === 'string') {
    resolvedSrc = src;
  } else if (src && typeof src === 'object') {
    // Attempt Sanity Image builder
    const sanityUrl = urlForImage(src);
    if (sanityUrl) {
      resolvedSrc = sanityUrl.url();
    } else {
      resolvedSrc = getMockPlaceholder(fallbackType, fallbackIndex);
    }
  } else {
    resolvedSrc = getMockPlaceholder(fallbackType, fallbackIndex);
  }

  return (
    <div className={cn('relative overflow-hidden w-full h-full bg-neutral-100', className)}>
      {loading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200" />
      )}
      <Image
        src={resolvedSrc}
        alt={alt}
        className={cn(
          'transition-all duration-700 ease-out object-cover',
          loading ? 'scale-105 blur-sm' : 'scale-100 blur-0'
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
