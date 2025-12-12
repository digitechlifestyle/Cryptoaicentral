import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  Mail, 
  Link as LinkIcon,
  Check,
  Gift
} from "lucide-react";
import { trackShare } from "../points/ShareTracker";

export default function SocialShareButtons({ 
  url, 
  title, 
  description = "",
  contentType = "home",
  contentId = null,
  variant = "default",
  className = ""
}) {
  const [copied, setCopied] = useState(false);
  const [showPointsEarned, setShowPointsEarned] = useState(false);

  // Clean up URL - use production domain instead of preview
  const getCleanUrl = () => {
    const currentUrl = url || window.location.href;
    
    // If it's a preview/staging URL, replace with production domain
    if (currentUrl.includes('base44.app') || currentUrl.includes('preview--')) {
      // Extract the path after the domain
      const urlObj = new URL(currentUrl);
      const path = urlObj.pathname + urlObj.search;
      
      // Use your production domain - UPDATE THIS with your actual domain
      return `https://cryptoaicentralcom.com${path}`;
    }
    
    return currentUrl;
  };

  const shareUrl = getCleanUrl();
  const shareTitle = title;
  const shareDesc = description;

  const handleShare = async (platform) => {
    // Track share and get share code
    const shareCode = await trackShare(platform, contentType, contentId);
    
    // Show points earned notification
    setShowPointsEarned(true);
    setTimeout(() => setShowPointsEarned(false), 3000);

    // For Twitter, keep URL short without tracking code (tracking happens on click)
    // For other platforms, add tracking
    const trackedUrl = platform === 'twitter' ? shareUrl : (shareCode 
      ? `${shareUrl}${shareUrl.includes('?') ? '&' : '?'}ref=${shareCode}`
      : shareUrl);

    // Better formatted text for each platform
    let shareText = '';
    
    if (platform === 'twitter') {
      // Twitter: Short, punchy text with URL at the end
      shareText = `${shareTitle}\n\n${trackedUrl}`;
    } else if (platform === 'linkedin') {
      // LinkedIn: More professional with context
      shareText = `${shareTitle}\n\n${shareDesc}\n\n${trackedUrl}`;
    } else {
      // Facebook/others: Title + URL
      shareText = shareTitle;
    }

    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trackedUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackedUrl)}&quote=${encodeURIComponent(shareTitle)}`,
      email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDesc + '\n\n' + trackedUrl)}`
    };

    if (platform !== 'copy_link' && platform !== 'instagram') {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    const shareCode = await trackShare('copy_link', contentType, contentId);
    const trackedUrl = shareCode 
      ? `${shareUrl}${shareUrl.includes('?') ? '&' : '?'}ref=${shareCode}`
      : shareUrl;

    try {
      await navigator.clipboard.writeText(trackedUrl);
      setCopied(true);
      setShowPointsEarned(true);
      setTimeout(() => {
        setCopied(false);
        setShowPointsEarned(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleInstagram = async () => {
    const shareCode = await trackShare('instagram', contentType, contentId);
    const trackedUrl = shareCode 
      ? `${shareUrl}${shareUrl.includes('?') ? '&' : '?'}ref=${shareCode}`
      : shareUrl;

    try {
      await navigator.clipboard.writeText(trackedUrl);
      setShowPointsEarned(true);
      setTimeout(() => setShowPointsEarned(false), 3000);
      alert("✅ +10 points! Link copied! Open Instagram and paste it into your story or post.\n\nEarn bonus points when people click and sign up!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (variant === "compact") {
    return (
      <div className={`relative ${className}`}>
        {showPointsEarned && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
            <Gift className="w-4 h-4" />
            <span className="font-bold">+10 points earned!</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="hover:bg-blue-50 hover:text-blue-600"
            title="Share on Twitter/X (+10 points)"
          >
            <Twitter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin')}
            className="hover:bg-blue-50 hover:text-blue-700"
            title="Share on LinkedIn (+10 points)"
          >
            <Linkedin className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="hover:bg-blue-50 hover:text-blue-800"
            title="Share on Facebook (+10 points)"
          >
            <Facebook className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleInstagram}
            className="hover:bg-pink-50 hover:text-pink-600"
            title="Share on Instagram (+10 points)"
          >
            <Instagram className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="hover:bg-slate-50"
            title="Copy Link (+10 points)"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    );
  }

  if (variant === "floating") {
    return (
      <div className={`fixed left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-40 ${className}`}>
        {showPointsEarned && (
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 whitespace-nowrap">
            <Gift className="w-4 h-4" />
            <span className="font-bold">+10 points!</span>
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('twitter')}
          className="bg-white hover:bg-blue-50 hover:text-blue-600 shadow-lg"
          title="Share on Twitter (+10 points)"
        >
          <Twitter className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('linkedin')}
          className="bg-white hover:bg-blue-50 hover:text-blue-700 shadow-lg"
          title="Share on LinkedIn (+10 points)"
        >
          <Linkedin className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('facebook')}
          className="bg-white hover:bg-blue-50 hover:text-blue-800 shadow-lg"
          title="Share on Facebook (+10 points)"
        >
          <Facebook className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleInstagram}
          className="bg-white hover:bg-pink-50 hover:text-pink-600 shadow-lg"
          title="Share on Instagram (+10 points)"
        >
          <Instagram className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          className="bg-white hover:bg-slate-50 shadow-lg"
          title="Copy Link (+10 points)"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
        </Button>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-4 ${className}`}>
      {showPointsEarned && (
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <Gift className="w-5 h-5" />
          <div>
            <div className="font-bold">+10 points earned!</div>
            <div className="text-sm text-green-100">Earn +25 points per click, +100 per signup!</div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
        <Gift className="w-4 h-4 text-yellow-500" />
        <span>Earn points when you share! (+10 per share, +25 per click, +100 per signup)</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
        >
          <Twitter className="w-4 h-4" />
          Twitter/X
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-800"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          onClick={handleInstagram}
          className="flex items-center gap-2 hover:bg-pink-50 hover:text-pink-600"
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare('email')}
          className="flex items-center gap-2 hover:bg-slate-50"
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="flex items-center gap-2 hover:bg-slate-50"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>
    </div>
  );
}