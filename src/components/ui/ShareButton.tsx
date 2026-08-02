import React, { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    title?: string;
    text?: string;
    url?: string;
    className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
    title = "Renewed Hope Achievements Tracker",
    text = "Check out the progress being made under President Tinubu's administration!",
    url,
    className,
}) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    // Use Web Share API if available
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: shareUrl,
                });
            } catch (error) {
                // User cancelled or error
                console.log("Share cancelled or failed:", error);
            }
        }
    };

    // Social media share links
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const openShareWindow = (url: string) => {
        window.open(url, "_blank", "width=600,height=400,noopener,noreferrer");
    };

    // If Web Share API is available, use it directly
    if (typeof navigator !== "undefined" && navigator.share) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                className={cn(
                    "flex items-center gap-2 group",
                    "hover:bg-brand-light-purple/50 hover:border-brand-purple",
                    "transition-all duration-300",
                    className
                )}
            >
                <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Share</span>
            </Button>
        );
    }

    // Fallback to dropdown menu
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "flex items-center gap-2 group",
                        "hover:bg-brand-light-purple/50 hover:border-brand-purple",
                        "transition-all duration-300",
                        className
                    )}
                >
                    <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Share</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                    onClick={() => openShareWindow(shareLinks.twitter)}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                    <span>Twitter / X</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => openShareWindow(shareLinks.facebook)}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <Facebook className="h-4 w-4 text-[#4267B2]" />
                    <span>Facebook</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => openShareWindow(shareLinks.linkedin)}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <Linkedin className="h-4 w-4 text-[#0077B5]" />
                    <span>LinkedIn</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Link2 className="h-4 w-4" />
                            <span>Copy Link</span>
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ShareButton;
