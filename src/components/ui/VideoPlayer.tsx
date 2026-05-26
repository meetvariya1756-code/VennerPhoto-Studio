'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  showControls?: boolean;
}

export default function VideoPlayer({
  src,
  poster,
  autoplay = false,
  loop = true,
  muted = true,
  className,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn('relative group overflow-hidden w-full h-full bg-black', className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300 pointer-events-none" />

      {/* Center Big Play Button (shows when paused) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#C9A86C]/90 hover:border-transparent hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 z-10"
        >
          <Play className="w-6 h-6 fill-current ml-1" />
        </button>
      )}

      {/* Control Overlay */}
      {showControls && (
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent z-10">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-[#C9A86C] transition-colors">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-[#C9A86C] transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          <span className="text-xs text-white/60 tracking-wider uppercase font-sans">Venner Reels</span>
        </div>
      )}
    </div>
  );
}
