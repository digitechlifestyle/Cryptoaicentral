
import React, { useState, useEffect } from "react";
import { DirectoryListing } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Crown, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ListingGrid from "../components/browse/ListingGrid";
import SeoMeta from "../components/shared/SeoMeta";
import { allSeoArticles } from "@/data/allSeoArticles";

const featuredSlugs = ["what-is-bitcoin", "crypto-wallets-guide", "crypto-exchanges-guide", "best-ai-crypto-tools", "what-is-defi", "crypto-tax-basics"];

function guideUrl(slug) {
  return createPageUrl("GuidePost") + `?slug=${slug}`;
}

function safeWordCount(article) {
  if (typeof article.word_count === "number" && article.word_count > 0) return article.word_count.toLocaleString();
  return "1,500+";
}

function safeImage(article) {
  return article.image_url || `https://placehold.co/900x500/0f172a/ffffff?text=${encodeURIComponent(article.category || "Crypto AI Guide")}`;
}

function getFallbackFeatured() {
  const selected = featuredSlugs.map((slug) => allSeoArticles.find((article) => article.slug === slug)).filter(Boolean);
  return selected.length ? selected : allSeoArticles.slice(0, 6);
}

export default function FeaturedPage() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [sponsoredListings, setSponsoredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackGuides = getFallbackFeatured();

  useEffect(() => {
    loadFeaturedListings();
  }, []);

  const loadFeaturedListings = async () => {
    setIsLoading(true);
    try {
      const [featured, sponsored] = await Promise.all([
        DirectoryListing.filter({ featured: true, status: 'approved' }, "-created_date", 50),
        DirectoryListing.filter({ sponsored: true, status: 'approved' }, "-created_date", 50)
      ]);
      const sponsoredIds = new Set(sponsored.map(s => s.id));
      setFeaturedListings(featured.filter(f => !sponsoredIds.has(f.id)));
      setSponsoredListings(sponsored);
    } catch (error) {
      console.error("Error loading featured listings:", error);
      setFeaturedListings([]);
      setSponsoredListings([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta title="Featured Crypto and AI Guides | Crypto AI Central" description="Hand-picked crypto, AI, wallet, exchange, DeFi and tax guides selected for beginners and builders learning digital assets and Web3 tools." keywords="featured crypto guides, AI crypto tools, Bitcoin guide, crypto wallet guide, DeFi guide, crypto tax" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to={createPageUrl("Home")}><Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <Badge className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0"><Star className="w-3 h-3 mr-1" />Featured</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Projects and Guides</h1>
          <p className="text-xl text-slate-600 max-w-4xl">Hand-picked selections of useful crypto, AI, wallet, exchange, DeFi and tax resources. If live directory listings are not available yet, this page still shows curated long-form guides.</p>
        </div>

        {sponsoredListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6"><Crown className="w-6 h-6 text-purple-600" /><h2 className="text-2xl font-bold text-slate-900">Sponsored</h2><Badge className="bg-purple-100 text-purple-700">Premium Partners</Badge></div>
            <ListingGrid listings={sponsoredListings} isLoading={false} />
          </div>
        )}

        {featuredListings.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-6"><Star className="w-6 h-6 text-yellow-500" /><h2 className="text-2xl font-bold text-slate-900">Editor's Choice</h2><Badge className="bg-yellow-100 text-yellow-700">Curated Selection</Badge></div>
            <ListingGrid listings={featuredListings} isLoading={isLoading} />
          </div>
        ) : (
          <section>
            <div className="flex items-center gap-2 mb-6"><BookOpen className="w-6 h-6 text-blue-600" /><h2 className="text-2xl font-bold text-slate-900">Editor's Choice Guides</h2><Badge className="bg-blue-100 text-blue-700">Fallback Content</Badge></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallbackGuides.map((article) => (
                <Link key={article.slug} to={guideUrl(article.slug)} className="group">
                  <Card className="h-full overflow-hidden bg-white border-slate-200 hover:shadow-xl transition-all">
                    <div className="h-44 bg-slate-950 overflow-hidden relative">
                      <img src={safeImage(article)} alt={article.image_alt || `${article.title} image`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      <Badge className="absolute left-4 bottom-4 bg-blue-600 text-white">{article.category}</Badge>
                    </div>
                    <CardContent className="p-6 flex flex-col h-[calc(100%-11rem)]">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><span>{article.reading_time || 8} min read</span><span>•</span><span>{safeWordCount(article)} words</span></div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600">{article.title}</h3>
                      <p className="text-slate-600 text-sm flex-1 line-clamp-4">{article.excerpt}</p>
                      <div className="mt-5 flex items-center gap-2 text-blue-600 font-semibold text-sm">Read featured guide <ArrowRight className="w-4 h-4" /></div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
