
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

export default function BrowsePage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
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
  // Add category counts for tabs
  const [categoryCounts, setCategoryCounts] = useState({});


  useEffect(() => {
    loadListings();
    
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const chainParam = urlParams.get('chain');
    const categoryParam = urlParams.get('category'); // Added for category tab deep linking
    
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
  }, [listings]); // Recalculate if 'listings' changes

  const applyFilters = useCallback(() => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.name.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(listing => listing[key] === value);
      }
    });

    // Sort by sponsored, then by name
    filtered.sort((a, b) => {
      if (a.sponsored && !b.sponsored) return -1;
      if (!a.sponsored && b.sponsored) return 1;
      return a.name.localeCompare(b.name);
    });

    setFilteredListings(filtered);
  }, [listings, searchQuery, filters]);

  useEffect(() => {
    applyFilters();
    calculateCategoryCounts(); // Calculate category counts after listings are loaded/filtered
  }, [applyFilters, calculateCategoryCounts]); // Depend on both applyFilters and calculateCategoryCounts

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const data = await DirectoryListing.filter({ status: 'approved' }, "-created_date", 500);
      setListings(data);
    } catch (error) {
      console.error("Error loading listings:", error);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      chain: "",
      type: "",
      risk: "",
      kyc_required: "",
      pricing: ""
    });
    setSearchQuery("");
  };

  const handleCategoryTabChange = (category) => {
    if (category === "All") {
      setFilters(prev => ({ ...prev, category: "" }));
    } else {
      setFilters(prev => ({ ...prev, category: category }));
    }
  };

  const getCurrentCategory = () => {
    return filters.category || "All";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">
            Browse All Projects
          </h1>
          <p className="text-lg sm:text-xl text-slate-600">
            Explore {listings.length}+ curated AI and crypto tools
          </p>
        </div>

        {/* Category Tabs */}
        <CategoryTabs 
          activeCategory={getCurrentCategory()}
          onCategoryChange={handleCategoryTabChange}
          showCounts={true}
          categoryCounts={categoryCounts}
        />

        {/* Ad Spaces */}
        <div className="mb-6 sm:mb-8 flex justify-center">
            <RotatingBanner bannerType="leaderboard" />
        </div>
        
        {/* Google AdSense Leaderboard */}
        <GoogleAd 
          adSlot="1234567890" 
          style={{ display: 'block', width: '728px', height: '90px', textAlign: 'center', margin: '0 auto 2rem', maxWidth: '100%' }}
          adFormat="horizontal"
        />

        {/* Search and View Controls */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex-1 max-w-full lg:max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <Input
                  placeholder="Search projects, categories, chains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 py-2 sm:py-3 text-sm sm:text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
              </Button>
              
              <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0 order-2 lg:order-1 space-y-6`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              totalResults={filteredListings.length}
            />
            
            {/* Sidebar Vertical Banner */}
            <div className="hidden lg:block">
              <RotatingBanner bannerType="vertical" />
            </div>
            
            {/* Sidebar Google Ad */}
            <div className="hidden lg:block">
              <GoogleAd 
                adSlot="0987654321" 
                style={{ display: 'block', width: '300px', height: '600px' }}
                adFormat="vertical"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <p className="text-sm sm:text-base text-slate-600">
                Showing {filteredListings.length} results
              </p>
            </div>

            <ListingGrid 
              listings={filteredListings}
              isLoading={isLoading}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
