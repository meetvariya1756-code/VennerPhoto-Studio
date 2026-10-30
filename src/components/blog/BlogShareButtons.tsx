'use client';

import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Facebook, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogShareButtonsProps {
  url: string;
  title: string;
}

export default function BlogShareButtons({ url, title }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      {/* WhatsApp */}
      <button
        onClick={shareWhatsApp}
        className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      {/* Facebook */}
      <button
        onClick={shareFacebook}
        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"
        title="Share on Facebook"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>

      {/* Twitter */}
      <button
        onClick={shareTwitter}
        className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center transition-all"
        title="Share on X / Twitter"
        aria-label="Share on X / Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 text-xs text-neutral-600 hover:border-[#C9A86C] hover:text-[#8C6D39] transition-all bg-white"
        title="Copy article link"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied' : 'Copy Link'}</span>
      </button>
    </div>
  );
}

