import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";

import HeroSection from "../components/home/HeroSection";
import ValueProposition from "../components/home/ValueProposition";
import FeaturedSection from "../components/home/FeaturedSection";
import ShowcaseExamples from "../components/home/ShowcaseExamples";
import EcosystemGrid from "../components/home/EcosystemGrid";
import TrendingCategories from "../components/home/TrendingCategories";
import Testimonials from "../components/home/Testimonials";
import LatestAdditions from "../components/home/LatestAdditions";
import TrustStatistics from "../components/home/TrustStatistics";
import CTASection from "../components/home/CTASection";
import SeoMeta from "../components/shared/SeoMeta";
import CategoryTabs from "../components/shared/CategoryTabs";
import RotatingBanner from "../components/shared/RotatingBanner";
import GoogleAd from "../components/shared/GoogleAd";
import ShareTracker from "../components/points/ShareTracker";
import LivePriceWidget from "../components/crypto/LivePriceWidget";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredListings, setFeaturedListings] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();

    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
    }

    // Ensure viewport is set correctly
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // INCREASED LIMITS: Show more listings on homepage
      const [featured, latest] = await Promise.all([
        base44.entities.DirectoryListing.filter({ featured: true, status: 'approved' }, "-created_date", 20),
        base44.entities.DirectoryListing.filter({ status: 'approved' }, "-created_date", 50)
      ]);
      
      console.log("✅ Loaded data:", { featured: featured.length, latest: latest.length });
      
      const featuredIds = new Set(featured.map(f => f.id));
      const uniqueLatest = latest.filter(l => !featuredIds.has(l.id));

      setFeaturedListings(featured);
      setLatestListings(uniqueLatest);
    } catch (error) {
      console.error("❌ Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = createPageUrl("Browse") + `?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <ShareTracker />
      
      <SeoMeta 
        title="Discover the Best AI & Crypto Tools | Crypto AI Central"
        description="Your comprehensive guide to cutting-edge AI trading bots, DeFi protocols, wallets, and blockchain infrastructure. Carefully curated for the modern crypto ecosystem."
        keywords="crypto tools, AI trading bots, DeFi protocols, crypto wallets, blockchain analytics, cryptocurrency directory"
      />
      
      {/* Hero Section */}
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      
      {/* Leaderboard Ad - Top of Home */}
      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center">
          <RotatingBanner bannerType="leaderboard" />
        </div>
      </div>
      
      {/* Category Tabs */}
      <CategoryTabs />
      
      <div className="space-y-0 w-full">
        {/* Value Proposition */}
        <ValueProposition />

        {/* Featured Section - NOW SHOWING UP TO 20 FEATURED LISTINGS */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-yellow-50/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <FeaturedSection 
              listings={featuredListings}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Rectangle Ad - After Featured */}
        <div className="py-6 flex justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RotatingBanner bannerType="rectangle" />
          </div>
        </div>
        
        {/* Google AdSense - Leaderboard */}
        <div className="py-4 flex justify-center">
          <GoogleAd 
            adSlot="1234567890" 
            style={{ display: 'block', width: '728px', height: '90px', maxWidth: '100%' }}
            adFormat="horizontal"
          />
        </div>

        {/* Trust Statistics */}
        <TrustStatistics />

        {/* Showcase Examples */}
        <ShowcaseExamples />

        {/* Ecosystem Grid */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-yellow-50/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <EcosystemGrid />
          </div>
        </div>

        {/* Mobile Banner Ad */}
        <div className="md:hidden py-4 flex justify-center">
          <RotatingBanner bannerType="mobile" />
        </div>

        {/* Live Prices Widget */}
        <div className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <LivePriceWidget />
          </div>
        </div>

        {/* Trending Categories */}
        <div className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <TrendingCategories />
          </div>
        </div>

        {/* Testimonials */}
        <Testimonials />

        {/* Latest Additions - NOW SHOWING UP TO 50 LISTINGS */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-yellow-50/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <LatestAdditions 
              listings={latestListings}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Call to Action */}
        <CTASection />
      </div>
    </div>
  );
}