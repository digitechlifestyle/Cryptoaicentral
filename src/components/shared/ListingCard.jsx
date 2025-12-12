
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shield, Star, CheckCircle, Share2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ListingCard({ listing, featured = false }) {
  const [copied, setCopied] = useState(false);

  const handleQuickShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const projectUrl = window.location.origin + createPageUrl("Project") + `?id=${listing.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.name,
          text: listing.description,
          url: projectUrl
        });
      } else {
        await navigator.clipboard.writeText(projectUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // User cancelled share or operation failed
      console.log("Share cancelled or failed:", error);
    }
  };

  const getTierBadge = () => {
    if (listing.tier === 'sponsored') {
      return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">Sponsored</Badge>;
    }
    if (listing.tier === 'featured' || listing.featured) {
      return <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">Featured</Badge>;
    }
    return null;
  };

  // Generate a unique color based on the listing name
  const getColorFromName = (name) => {
    const colors = [
      'from-blue-500 to-indigo-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-cyan-500 to-blue-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500',
      'from-teal-500 to-green-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {listing.logo_url ? (
            <img
              src={listing.logo_url}
              alt={`${listing.name} logo`}
              className="w-16 h-16 rounded-[18px] object-cover border border-slate-200 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // If image fails to load, replace with fallback
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          <div 
            className={`w-16 h-16 rounded-[18px] bg-gradient-to-br ${getColorFromName(listing.name)} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-300`}
            style={{ display: listing.logo_url ? 'none' : 'flex' }}
          >
            {listing.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Link to={createPageUrl("Project") + `?id=${listing.id}`}>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                  {listing.name}
                </h3>
              </Link>
              {(listing.kyc_verified || listing.audit_completed) && (
                <div className="flex gap-1 flex-shrink-0">
                  {listing.kyc_verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" title="KYC Verified" />
                  )}
                  {listing.audit_completed && (
                    <Shield className="w-5 h-5 text-blue-500" title="Audited" />
                  )}
                </div>
              )}
            </div>
            {getTierBadge()}
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2" title={listing.description}>
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">{listing.category}</Badge>
          {listing.chain && listing.chain !== '-' && (
            <Badge variant="outline" className="text-xs">{listing.chain}</Badge>
          )}
          {listing.tags && listing.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Link to={createPageUrl("Project") + `?id=${listing.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              View Details
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleQuickShare}
            title="Share this project"
            className="flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
