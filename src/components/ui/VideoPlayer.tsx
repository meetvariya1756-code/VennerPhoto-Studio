'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  showControls?: boolean;
  allowRotate?: boolean;
  initialRotation?: number;
  allowFitToggle?: boolean;
  defaultFit?: 'cover' | 'contain';
}

export default function VideoPlayer({
  src,
  poster,
  autoplay = false,
  loop = true,
  muted = true,
  className,
  showControls = true,
  allowRotate = true,
  initialRotation = 0,
  allowFitToggle = true,
  defaultFit = 'cover',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [rotation, setRotation] = useState<number>(initialRotation);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>(defaultFit);
  const [aspectScale, setAspectScale] = useState<number>(1.7778);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const toggleRotation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFitMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFitMode(prev => (prev === 'cover' ? 'contain' : 'cover'));
  };

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.videoWidth && video.videoHeight) {
      const ratio = video.videoWidth / video.videoHeight;
      if (ratio > 1) {
        setAspectScale(ratio);
      } else if (ratio < 1) {
        setAspectScale(1 / ratio);
      }
    }
  };

  const isRotated = rotation === 90 || rotation === 270;
  const computedScale = isRotated ? (fitMode === 'cover' ? aspectScale : 1) : 1;
  const transformStyle = `rotate(${rotation}deg) scale(${computedScale})`;

  return (
    <div className={cn('relative group overflow-hidden w-full h-full bg-black flex items-center justify-center', className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
        onLoadedMetadata={handleMetadata}
        style={{
          transform: transformStyle,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={cn(
          'w-full h-full transition-all duration-300',
          fitMode === 'cover' ? 'object-cover' : 'object-contain'
        )}
        onClick={() => togglePlay()}
      />

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-300 pointer-events-none" />

      {/* Center Big Play Button (shows when paused) */}
      {!isPlaying && (
        <button
          onClick={() => togglePlay()}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#C9A86C]/90 hover:border-transparent hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 z-20"
        >
          <Play className="w-6 h-6 fill-current ml-1" />
        </button>
      )}

      {/* Control Overlay */}
      {showControls && (
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={e => togglePlay(e)}
              className="text-white hover:text-[#C9A86C] transition-colors p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={toggleMute}
              className="text-white hover:text-[#C9A86C] transition-colors p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {allowRotate && (
              <button
                onClick={toggleRotation}
                className={cn(
                  'text-white hover:text-[#C9A86C] transition-colors p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-sans font-medium',
                  rotation > 0 ? 'bg-[#C9A86C] text-black hover:bg-[#C9A86C]/80 font-bold' : 'bg-white/10 hover:bg-white/20'
                )}
                title="Rotate video orientation"
              >
                <RotateCw className="w-4 h-4" />
                <span>{rotation}°</span>
              </button>
            )}

            {allowFitToggle && (
              <button
                onClick={toggleFitMode}
                className="text-white hover:text-[#C9A86C] transition-colors p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                title={fitMode === 'cover' ? 'Fit to Screen' : 'Fill Screen'}
              >
                {fitMode === 'cover' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          <span className="text-[11px] text-white/70 tracking-widest uppercase font-sans font-semibold">
            Venner Reels
          </span>
        </div>
      )}
    </div>
  );
}

