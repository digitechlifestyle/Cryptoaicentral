
import React, { useState, useEffect, useCallback } from "react";
import { DirectoryListing } from "@/api/entities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid3x3, List, SlidersHorizontal } from "lucide-react";

import ListingGrid from "../components/browse/ListingGrid";
import FilterSidebar from "../components/browse/FilterSidebar";
import RotatingBanner from "../components/shared/RotatingBanner";
import GoogleAd from "../components/shared/GoogleAd";
import CategoryTabs from "../components/shared/CategoryTabs";
import SeoMeta from "../components/shared/SeoMeta";

const fallbackListings = [
  {
    id: "guide-bitcoin",
    name: "Bitcoin Beginner Guide",
    category: "Crypto",
    chain: "Bitcoin",
    type: "Education",
    risk: "Medium",
    kyc_required: "No",
    pricing: "Free",
    description: "A long-form beginner guide explaining Bitcoin, wallets, mining, risks, security and practical next steps.",
    website: "/Cryptoaicentral/GuidePost?slug=what-is-bitcoin",
    tags: ["Bitcoin", "Beginner", "Digital Money", "Wallets"],
    featured: true,
    sponsored: false,
    status: "approved"
  },
  {
    id: "guide-wallets",
    name: "Crypto Wallets Guide",
    category: "Crypto Wallets",
    chain: "Multi-chain",
    type: "Education",
    risk: "Medium",
    kyc_required: "No",
    pricing: "Free",
    description: "Learn hot wallets, cold wallets, seed phrases, private keys, self-custody and wallet safety.",
    website: "/Cryptoaicentral/GuidePost?slug=crypto-wallets-guide",
    tags: ["Wallets", "Security", "Self-custody"],
    featured: true,
    sponsored: false,
    status: "approved"
  },
  {
    id: "guide-exchanges",
    name: "Crypto Exchanges Guide",
    category: "Exchanges",
    chain: "Multi-chain",
    type: "Education",
    risk: "Medium",
    kyc_required: "Yes",
    pricing: "Free",
    description: "Compare exchange types, custody, liquidity, trading fees, KYC and beginner safety checks.",
    website: "/Cryptoaicentral/GuidePost?slug=crypto-exchanges-guide",
    tags: ["Exchanges", "Trading", "Fees", "KYC"],
    featured: true,
    sponsored: false,
    status: "approved"
  },
  {
    id: "guide-ai-tools",
    name: "Best AI Crypto Tools Guide",
    category: "AI Trading Bots",
    chain: "Multi-chain",
    type: "Research",
    risk: "Medium",
    kyc_required: "No",
    pricing: "Free",
    description: "Understand AI crypto tools, research assistants, trading bots, dashboards and automation risks.",
    website: "/Cryptoaicentral/GuidePost?slug=best-ai-crypto-tools",
    tags: ["AI", "Research", "Automation", "Trading Bots"],
    featured: true,
    sponsored: false,
    status: "approved"
  },
  {
    id: "guide-defi",
    name: "DeFi Explained Guide",
    category: "DeFi Protocols",
    chain: "Multi-chain",
    type: "Education",
    risk: "High",
    kyc_required: "No",
    pricing: "Free",
    description: "Learn lending, liquidity pools, staking, smart contracts, stablecoins and DeFi risk management.",
    website: "/Cryptoaicentral/GuidePost?slug=what-is-defi",
    tags: ["DeFi", "Smart Contracts", "Yield", "Stablecoins"],
    featured: false,
    sponsored: false,
    status: "approved"
  },
  {
    id: "guide-tax",
    name: "Crypto Tax Basics Guide",
    category: "Tax",
    chain: "Multi-chain",
    type: "Education",
    risk: "Low",
    kyc_required: "No",
    pricing: "Free",
    description: "Understand record keeping, taxable events, CSV exports, software tools and professional advice triggers.",
    website: "/Cryptoaicentral/GuidePost?slug=crypto-tax-basics",
    tags: ["Tax", "Records", "Compliance", "Reporting"],
    featured: false,
    sponsored: false,
    status: "approved"
  }
];

export default function BrowsePage() {
  const [listings, setListings] = useState(fallbackListings);
  const [filteredListings, setFilteredListings] = useState(fallbackListings);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    chain: "", 
    type: "",
    risk: "",
    kyc_required: "",
    pricing: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    loadListings();
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const chainParam = urlParams.get('chain');
    const categoryParam = urlParams.get('category');
    if (searchParam) setSearchQuery(searchParam);
    if (chainParam) setFilters(prev => ({ ...prev, chain: chainParam }));
    if (categoryParam) setFilters(prev => ({ ...prev, category: categoryParam }));
  }, []);

  const calculateCategoryCounts = useCallback(() => {
    const counts = { All: listings.length };
    listings.forEach(listing => {
      counts[listing.category] = (counts[listing.category] || 0) + 1;
    });
    setCategoryCounts(counts);
  }, [listings]);

  const applyFilters = useCallback(() => {
    let filtered = [...listings];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.name.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value) filtered = filtered.filter(listing => String(listing[key]) === String(value));
    });
    filtered.sort((a, b) => {
      if (a.sponsored && !b.sponsored) return -1;
      if (!a.sponsored && b.sponsored) return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
    setFilteredListings(filtered);
  }, [listings, searchQuery, filters]);

  useEffect(() => {
    applyFilters();
    calculateCategoryCounts();
  }, [applyFilters, calculateCategoryCounts]);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const data = await DirectoryListing.filter({ status: 'approved' }, "-created_date", 500);
      setListings(data && data.length ? [...data, ...fallbackListings] : fallbackListings);
    } catch (error) {
      console.error("Error loading listings, using fallback educational content:", error);
      setListings(fallbackListings);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters({ category: "", chain: "", type: "", risk: "", kyc_required: "", pricing: "" });
    setSearchQuery("");
  };

  const handleCategoryTabChange = (category) => {
    setFilters(prev => ({ ...prev, category: category === "All" ? "" : category }));
  };

  const getCurrentCategory = () => filters.category || "All";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta
        title="Browse Crypto and AI Guides, Tools and Research | Crypto AI Central"
        description="Browse crypto, AI, wallet, exchange, DeFi, tax and Web3 guides. Includes fallback educational content so every browse result links to useful long-form pages."
        keywords="browse crypto tools, AI crypto tools, crypto guides, crypto wallets, exchanges, DeFi, crypto tax"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">Browse All Projects</h1>
          <p className="text-lg sm:text-xl text-slate-600">Explore {listings.length}+ curated AI and crypto guides, tools and learning resources.</p>
        </div>

        <CategoryTabs activeCategory={getCurrentCategory()} onCategoryChange={handleCategoryTabChange} showCounts={true} categoryCounts={categoryCounts} />

        <div className="mb-6 sm:mb-8 flex justify-center"><RotatingBanner bannerType="leaderboard" /></div>
        <GoogleAd adSlot="1234567890" style={{ display: 'block', width: '728px', height: '90px', textAlign: 'center', margin: '0 auto 2rem', maxWidth: '100%' }} adFormat="horizontal" />

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex-1 max-w-full lg:max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <Input placeholder="Search guides, categories, chains..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 sm:pl-12 py-2 sm:py-3 text-sm sm:text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"><SlidersHorizontal className="w-4 h-4" /><span className="hidden sm:inline">Filters</span><span className="sm:hidden">Filter</span></Button>
              <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-lg">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}><Grid3x3 className="w-4 h-4" /></Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0 order-2 lg:order-1 space-y-6`}>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} totalResults={filteredListings.length} />
            <div className="hidden lg:block"><RotatingBanner bannerType="vertical" /></div>
            <div className="hidden lg:block"><GoogleAd adSlot="0987654321" style={{ display: 'block', width: '300px', height: '600px' }} adFormat="vertical" /></div>
          </div>
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            <div className="mb-4 sm:mb-6 flex items-center justify-between"><p className="text-sm sm:text-base text-slate-600">Showing {filteredListings.length} results</p></div>
            <ListingGrid listings={filteredListings} isLoading={isLoading} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}