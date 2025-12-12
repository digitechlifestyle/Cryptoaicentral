
import React, { useState, useEffect } from "react";
import { DirectoryListing } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ListingGrid from "../components/browse/ListingGrid";

export default function FeaturedPage() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [sponsoredListings, setSponsoredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedListings();
  }, []);

  const loadFeaturedListings = async () => {
    setIsLoading(true);
    try {
      const [featured, sponsored] = await Promise.all([
        // Only show approved AND featured listings
        DirectoryListing.filter({ featured: true, status: 'approved' }, "-created_date", 50),
        // Only show approved AND sponsored listings  
        DirectoryListing.filter({ sponsored: true, status: 'approved' }, "-created_date", 50)
      ]);
      
      const sponsoredIds = new Set(sponsored.map(s => s.id));
      const uniqueFeatured = featured.filter(f => !sponsoredIds.has(f.id));

      setFeaturedListings(uniqueFeatured);
      setSponsoredListings(sponsored);
    } catch (error) {
      console.error("Error loading featured listings:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl("Home")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Badge className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Featured Projects
          </h1>
          
          <p className="text-xl text-slate-600">
            Hand-picked selections of the most innovative and trusted platforms
          </p>
        </div>

        {/* Sponsored Section */}
        {sponsoredListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-slate-900">Sponsored</h2>
              <Badge className="bg-purple-100 text-purple-700">
                Premium Partners
              </Badge>
            </div>
            
            <ListingGrid 
              listings={sponsoredListings}
              isLoading={false}
            />
          </div>
        )}

        {/* Featured Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-slate-900">Editor's Choice</h2>
            <Badge className="bg-yellow-100 text-yellow-700">
              Curated Selection
            </Badge>
          </div>
          
          <ListingGrid 
            listings={featuredListings}
            isLoading={isLoading}
          />
        </div>

        {featuredListings.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No featured projects yet</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Featured projects will appear here once they've been curated by our team.
            </p>
            <Link to={createPageUrl("Browse")}>
              <Button>Browse All Projects</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
