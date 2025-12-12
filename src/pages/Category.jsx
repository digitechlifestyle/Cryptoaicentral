
import React, { useState, useEffect, useCallback } from "react";
import { DirectoryListing } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton"; // Added for skeleton loading

import ListingGrid from "../components/browse/ListingGrid";
import ListingCard from "../components/shared/ListingCard"; // Corrected ListingCard import path
import FilterSidebar from "../components/browse/FilterSidebar";
import LoadingGrid from "../components/shared/LoadingGrid"; // Added for loading states
import RotatingBanner from "../components/shared/RotatingBanner";
import SeoMeta from "../components/shared/SeoMeta";
import CategoryTabs from "../components/shared/CategoryTabs";
import GoogleAd from "../components/shared/GoogleAd"; // Added GoogleAd import

export default function CategoryPage() {
  const [allListings, setAllListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    chain: "",
    type: "",
    risk: "",
    kyc_required: "",
    pricing: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('cat');
    
    if (categoryParam) {
      setCategory(categoryParam);
      setFilters(prev => ({ ...prev, category: categoryParam }));
      loadCategoryListings(categoryParam);
    }
  }, []);

  const loadCategoryListings = async (categoryName) => {
    setIsLoading(true);
    try {
      const [allData, featuredData] = await Promise.all([
        // Load all approved listings in this category first
        DirectoryListing.filter({ category: categoryName, status: 'approved' }, "-created_date", 100),
        DirectoryListing.filter({ category: categoryName, featured: true, status: 'approved' }, "-created_date", 6)
      ]);
      
      console.log(`Category ${categoryName} - All: ${allData.length}, Featured: ${featuredData.length}`); // Debug log
      
      // Remove duplicates by ID
      const uniqueAll = allData.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );
      const uniqueFeatured = featuredData.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );
      
      setAllListings(uniqueAll);
      setFeaturedListings(uniqueFeatured);
    } catch (error) {
      console.error("Error loading category listings:", error);
    }
    setIsLoading(false);
  };

  const applyFilters = useCallback(() => {
    // Filter the main list, excluding items that are already in the featured list
    let mainList = allListings.filter(l => !featuredListings.some(f => f.id === l.id));

    // Apply non-category filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'category') {
        mainList = mainList.filter(listing => listing[key] === value);
      }
    });

    setFilteredListings(mainList);
  }, [allListings, featuredListings, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: category,
      chain: "",
      type: "",
      risk: "",
      kyc_required: "",
      pricing: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta 
        title={`${category || 'Category'} Tools & Platforms | Crypto AI Central`}
        description={`Explore all projects, tools, and platforms in the ${category || 'crypto'} category on Crypto AI Central.`}
      />

      {/* Category Tabs */}
      <CategoryTabs activeCategory={category} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl("Home")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Badge variant="outline" className="px-3 py-1">
              Category
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {category}
          </h1>
          
          <p className="text-xl text-slate-600">
            Explore {allListings.length} curated {category.toLowerCase()} projects in our directory
          </p>
        </div>

        {/* Leaderboard Ad */}
        <div className="mb-8 flex justify-center">
            <RotatingBanner bannerType="leaderboard" />
        </div>
        
        {/* Google AdSense */}
        <div className="mb-8 flex justify-center">
          <GoogleAd 
            adSlot="1234567890" 
            style={{ display: 'block', width: '728px', height: '90px', maxWidth: '100%' }}
            adFormat="horizontal"
          />
        </div>
        
        {/* Featured in Category Section */}
        {isLoading ? (
          <div className="mb-12">
            <Skeleton className="h-8 w-64 mb-6" />
            <LoadingGrid count={3} />
          </div>
        ) : featuredListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-slate-900">Featured in {category}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredListings.map(listing => (
                <div key={listing.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative">
                    {/* Render single listing using ListingCard for consistent styling */}
                    <ListingCard listing={listing} featured={true} />
                  </div>
                </div>
              ))}
            </div>
             <hr className="border-slate-200" />
          </div>
        )}

        {/* Filter Toggle for Mobile */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters ({filteredListings.length} results)
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              totalResults={filteredListings.length}
            />
            
            {/* Vertical Banner in Sidebar */}
            <div className="mt-6 hidden lg:block">
              <RotatingBanner bannerType="vertical" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {featuredListings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">All {category} Projects</h3>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-600">
                Showing {filteredListings.length} results
              </p>
            </div>

            <ListingGrid 
              listings={filteredListings}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
