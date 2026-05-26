
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DirectoryListing } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Filter, Star, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

import ListingGrid from "../components/browse/ListingGrid";
import ListingCard from "../components/shared/ListingCard";
import FilterSidebar from "../components/browse/FilterSidebar";
import LoadingGrid from "../components/shared/LoadingGrid";
import RotatingBanner from "../components/shared/RotatingBanner";
import SeoMeta from "../components/shared/SeoMeta";
import CategoryTabs from "../components/shared/CategoryTabs";
import GoogleAd from "../components/shared/GoogleAd";
import { allSeoArticles } from "@/data/allSeoArticles";

const categoryGuideMap = {
  "Crypto Wallets": ["crypto-wallets-guide", "hardware-wallets-vs-software-wallets", "digital-wallets-and-ai-payments", "what-is-bitcoin"],
  "Exchanges": ["crypto-exchanges-guide", "crypto-trading-for-beginners", "what-is-bitcoin", "crypto-tax-basics"],
  "DeFi Protocols": ["what-is-defi", "stablecoins-guide", "portfolio-trackers-explained", "crypto-tax-basics"],
  "AI Trading Bots": ["ai-trading-bots-explained", "best-ai-crypto-tools", "what-are-ai-agents", "best-crypto-research-tools"],
  "Portfolio Trackers": ["portfolio-trackers-explained", "best-crypto-research-tools", "crypto-tax-basics", "how-to-research-a-crypto-project"],
  "On-Chain Analytics": ["best-crypto-research-tools", "how-to-research-a-crypto-project", "blockchain-basics", "portfolio-trackers-explained"],
  "Smart Contract Platforms": ["blockchain-basics", "what-is-defi", "how-to-create-a-crypto-token", "tokenisation-of-real-world-assets"],
  "Staking Platforms": ["what-is-defi", "stablecoins-guide", "portfolio-trackers-explained", "crypto-tax-basics"]
};

const categoryDescriptions = {
  "Crypto Wallets": "Learn wallet safety, self-custody, private keys, seed phrases and secure storage before trusting any wallet tool.",
  "Exchanges": "Compare trading platforms, fees, KYC, liquidity, custody and beginner risks before choosing where to buy or sell crypto.",
  "DeFi Protocols": "Understand smart contracts, lending, liquidity pools, stablecoins, staking and DeFi risk before connecting a wallet.",
  "AI Trading Bots": "Explore AI trading automation, research bots, backtesting, API permissions and risk controls without guaranteed-profit hype.",
  "Portfolio Trackers": "Track wallets, balances, DeFi positions, tax records and multi-chain exposure with safer read-only workflows.",
  "On-Chain Analytics": "Use blockchain data, dashboards and AI-assisted research to understand transactions, wallets and market behaviour.",
  "Smart Contract Platforms": "Learn how blockchains, smart contracts, token creation and Web3 apps connect across the digital asset ecosystem.",
  "Staking Platforms": "Understand staking rewards, lockups, validator risk, custody, slashing and tax records before staking assets."
};

function guideUrl(slug) {
  return createPageUrl("GuidePost") + `?slug=${slug}`;
}

function getFallbackGuides(category) {
  const slugs = categoryGuideMap[category] || [];
  const guides = slugs.map((slug) => allSeoArticles.find((article) => article.slug === slug)).filter(Boolean);
  return guides.length ? guides : allSeoArticles.slice(0, 6);
}

export default function CategoryPage() {
  const [allListings, setAllListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({ category: "", chain: "", type: "", risk: "", kyc_required: "", pricing: "" });
  const [showFilters, setShowFilters] = useState(false);

  const fallbackGuides = useMemo(() => getFallbackGuides(category), [category]);
  const intro = categoryDescriptions[category] || `Explore practical crypto and AI guides, risks, tools and comparisons for ${category || "this category"}.`;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('cat') || urlParams.get('category') || "Crypto Wallets";
    setCategory(categoryParam);
    setFilters(prev => ({ ...prev, category: categoryParam }));
    loadCategoryListings(categoryParam);
  }, []);

  const loadCategoryListings = async (categoryName) => {
    setIsLoading(true);
    try {
      const [allData, featuredData] = await Promise.all([
        DirectoryListing.filter({ category: categoryName, status: 'approved' }, "-created_date", 100),
        DirectoryListing.filter({ category: categoryName, featured: true, status: 'approved' }, "-created_date", 6)
      ]);
      const uniqueAll = allData.filter((item, index, self) => index === self.findIndex(t => t.id === item.id));
      const uniqueFeatured = featuredData.filter((item, index, self) => index === self.findIndex(t => t.id === item.id));
      setAllListings(uniqueAll);
      setFeaturedListings(uniqueFeatured);
    } catch (error) {
      console.error("Error loading category listings:", error);
      setAllListings([]);
      setFeaturedListings([]);
    }
    setIsLoading(false);
  };

  const applyFilters = useCallback(() => {
    let mainList = allListings.filter(l => !featuredListings.some(f => f.id === l.id));
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'category') mainList = mainList.filter(listing => String(listing[key]) === String(value));
    });
    setFilteredListings(mainList);
  }, [allListings, featuredListings, filters]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ category, chain: "", type: "", risk: "", kyc_required: "", pricing: "" });

  const hasDirectoryContent = featuredListings.length > 0 || filteredListings.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta
        title={`${category || 'Category'} Guides, Tools & Platforms | Crypto AI Central`}
        description={`${intro} Browse related long-form guides and curated tools on Crypto AI Central.`}
        keywords={`${category}, crypto guides, AI crypto tools, Web3, blockchain, wallets, DeFi`}
      />

      <CategoryTabs activeCategory={category} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl("Home")}><Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <Badge variant="outline" className="px-3 py-1">Category</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{category}</h1>
          <p className="text-xl text-slate-600 max-w-4xl">{intro}</p>
        </div>

        <div className="mb-8 flex justify-center"><RotatingBanner bannerType="leaderboard" /></div>
        <div className="mb-8 flex justify-center"><GoogleAd adSlot="1234567890" style={{ display: 'block', width: '728px', height: '90px', maxWidth: '100%' }} adFormat="horizontal" /></div>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Learning guides for {category}</h2>
            <Badge className="bg-blue-100 text-blue-700">Fallback content</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackGuides.map((article) => (
              <Link key={article.slug} to={guideUrl(article.slug)} className="group">
                <Card className="h-full overflow-hidden bg-white border-slate-200 hover:shadow-xl transition-all">
                  <div className="h-44 bg-slate-950 overflow-hidden relative">
                    <img src={article.image_url} alt={article.image_alt || `${article.title} image`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <Badge className="absolute left-4 bottom-4 bg-blue-600 text-white">{article.category}</Badge>
                  </div>
                  <CardContent className="p-6 flex flex-col h-[calc(100%-11rem)]">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><span>{article.reading_time} min read</span><span>•</span><span>{article.word_count?.toLocaleString?.() || "1,500+"} words</span></div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600">{article.title}</h3>
                    <p className="text-slate-600 text-sm flex-1 line-clamp-4">{article.excerpt}</p>
                    <div className="mt-5 flex items-center gap-2 text-blue-600 font-semibold text-sm">Read guide <ArrowRight className="w-4 h-4" /></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {isLoading ? (
          <div className="mb-12"><Skeleton className="h-8 w-64 mb-6" /><LoadingGrid count={3} /></div>
        ) : featuredListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6"><Star className="w-6 h-6 text-yellow-500" /><h2 className="text-2xl font-bold text-slate-900">Featured in {category}</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">{featuredListings.map(listing => <ListingCard key={listing.id} listing={listing} featured={true} />)}</div>
            <hr className="border-slate-200" />
          </div>
        )}

        <div className="lg:hidden mb-6"><Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2"><Filter className="w-4 h-4" />Filters ({filteredListings.length} results)</Button></div>

        <div className="flex gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0`}>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} totalResults={filteredListings.length} />
            <div className="mt-6 hidden lg:block"><RotatingBanner bannerType="vertical" /></div>
          </div>
          <div className="flex-1">
            <div className="mb-6"><h3 className="text-xl font-bold text-slate-900 mb-2">Directory results</h3><p className="text-slate-600">Showing {filteredListings.length} directory results{!hasDirectoryContent ? ". Use the learning guides above while curated listings are being added." : ""}</p></div>
            <ListingGrid listings={filteredListings} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
