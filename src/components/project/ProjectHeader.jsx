
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shield, Star, Crown } from "lucide-react";

import SocialShareButtons from "../shared/SocialShareButtons";

export default function ProjectHeader({ project }) {
  const handleVisit = () => {
    const link = project.affiliate_link || project.website;
    window.open(link, '_blank');
  };

  const avatar = project.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar/Logo - uniform 128x128px square on desktop, 96x96px on mobile */}
        <div className="flex-shrink-0">
          {project.logo_url ? (
            <img 
              src={project.logo_url} 
              alt={`${project.name} logo`} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-[24px] border bg-white object-cover"
              style={{ aspectRatio: '1/1' }}
            />
          ) : (
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-[24px] flex items-center justify-center border border-blue-500/30 relative overflow-hidden"
              style={{ 
                aspectRatio: '1/1',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(124, 58, 237, 0.26))',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              <span className="text-blue-600 text-5xl md:text-6xl font-bold tracking-wider relative z-10">
                {avatar}
              </span>
              <div 
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.7), transparent 60%)' }}
              />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="secondary" className="text-sm">{project.category}</Badge>
            {project.sponsored && (
              <Badge className="bg-purple-100 text-purple-700">
                <Crown className="w-3 h-3 mr-1" />
                Sponsored
              </Badge>
            )}
            {project.featured && !project.sponsored && (
              <Badge className="bg-yellow-100 text-yellow-700">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{project.name}</h1>
          <p className="text-slate-600 text-lg leading-relaxed">{project.description}</p>
          
          {project.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3">
          <Button 
            onClick={handleVisit}
            className="w-full md:w-auto gradient-bg text-white"
            size="lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Visit Website
          </Button>
          
          {project.referral_code && (
            <div className="p-3 w-full bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center">
              <p className="text-sm text-slate-600 mb-1">Referral Code:</p>
              <p className="font-mono text-lg font-bold text-slate-800 tracking-wider">{project.referral_code}</p>
            </div>
          )}
          <div className="text-xs text-slate-400 text-center md:text-right w-full">
            Links open in a new tab
          </div>
        </div>
      </div>

      {/* Social Share Section */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <SocialShareButtons
          url={typeof window !== 'undefined' ? window.location.href : ''} // Ensure window is defined for SSR
          title={`Check out ${project.name} on Crypto AI Central`}
          description={project.description}
          variant="compact"
        />
      </div>
    </div>
  );
}
