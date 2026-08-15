'use client';

import React, { useState } from "react";
import { Share2, Copy, Check, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementShareBarProps {
  title: string;
  url: string;
}

export const AchievementShareBar: React.FC<AchievementShareBarProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const fullUrl = window.location.origin + url;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Verified Achievement Record: "${title}" via Tinubu Achievement Tracker`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`, "_blank");
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Verified Achievement Record: "${title}" - ${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-gov-canvas dark:bg-gov-navy/20 border border-gov-border/60">
      <div className="flex items-center gap-2 text-xs font-bold text-gov-navy dark:text-white uppercase tracking-wider">
        <Share2 className="h-4 w-4 text-gov-gold" />
        <span>Share Achievement Record</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-8 text-xs font-semibold gap-1.5 border-gov-border text-gov-navy hover:bg-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-gov-emerald" />
              <span>Copied Link</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-gov-navy" />
              <span>Copy Link</span>
            </>
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={shareTwitter}
          aria-label="Share on X / Twitter"
          className="h-8 text-xs font-semibold border-gov-border text-gov-navy hover:bg-white px-2.5"
        >
          <Twitter className="h-3.5 w-3.5" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={shareWhatsApp}
          aria-label="Share on WhatsApp"
          className="h-8 text-xs font-semibold border-gov-border text-gov-navy hover:bg-white px-2.5"
        >
          <MessageCircle className="h-3.5 w-3.5 text-gov-emerald" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={shareLinkedIn}
          aria-label="Share on LinkedIn"
          className="h-8 text-xs font-semibold border-gov-border text-gov-navy hover:bg-white px-2.5"
        >
          <Linkedin className="h-3.5 w-3.5 text-blue-600" />
        </Button>
      </div>
    </div>
  );
};

export default AchievementShareBar;
