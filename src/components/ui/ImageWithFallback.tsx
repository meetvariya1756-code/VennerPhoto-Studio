'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn, getMockPlaceholder } from '@/lib/utils';
import { urlForImage } from '@/lib/sanity.image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: any; // Sanity Image object or local string url
  fallbackType?: 'photo' | 'avatar' | 'video-thumb' | 'logo' | 'hero';
  fallbackIndex?: number;
  objectFit?: 'cover' | 'contain';
}

export default function ImageWithFallback({
  src,
  fallbackType = 'photo',
  fallbackIndex = 0,
  alt = 'Venner Photography Asset',
  className,
  objectFit = 'cover',
  fill,
  width,
  height,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setError(false);
  }, [src]);

  // Hash helper for stable placeholder selection
  const getHashIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const itemHashIndex = typeof src === 'string' && src ? getHashIndex(src) : (fallbackIndex || getHashIndex(alt || 'default'));

  // Instantly resolve dead or placeholder-fallback URLs without trying to connect to dead servers
  const isDeadUrl = typeof src === 'string' && (
    !src ||
    src.includes('enkyolmjklvryvnzsmvt.supabase.co') ||
    src.includes('your-supabase-url')
  );

  // Resolve source URL
  let resolvedSrc = '';
  if (error || !src || isDeadUrl) {
    resolvedSrc = getMockPlaceholder(fallbackType, itemHashIndex);
  } else if (typeof src === 'string') {
    resolvedSrc = src;
  } else if (src && typeof src === 'object') {
    const sanityUrl = urlForImage(src);
    if (sanityUrl && !error) {
      resolvedSrc = sanityUrl.url();
    } else {
      resolvedSrc = getMockPlaceholder(fallbackType, itemHashIndex);
    }
  } else {
    resolvedSrc = getMockPlaceholder(fallbackType, itemHashIndex);
  }

  // Determine sizing: if neither width nor height is provided, default to fill mode
  const isFillMode = fill !== undefined ? fill : (!width && !height);

  return (
    <div className={cn('relative overflow-hidden w-full h-full', !className?.includes('bg-') && 'bg-neutral-100/50', className)}>
      <Image
        src={resolvedSrc}
        alt={alt}
        fill={isFillMode}
        width={!isFillMode ? width : undefined}
        height={!isFillMode ? height : undefined}
        unoptimized={resolvedSrc.startsWith('/uploads') || resolvedSrc.startsWith('data:')}
        className={cn(
          'transition-all duration-300 ease-out',
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        )}
        onError={() => {
          setError(true);
        }}
        {...props}
      />
    </div>
  );
}
