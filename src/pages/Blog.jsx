import React, { useState, useEffect, useCallback } from "react";
import { BlogPost } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User as UserIcon, Search, TrendingUp, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SeoMeta from "../components/shared/SeoMeta";
import RotatingBanner from "@/components/shared/RotatingBanner";
import GoogleAd from "@/components/shared/GoogleAd";
import { allSeoArticles, allArticleCategories } from "@/data/allSeoArticles";

function cardImageUrl(post) {
  const label = encodeURIComponent((post.category || "Crypto AI") + " Guide");
  return `https://placehold.co/900x500/0f172a/ffffff?text=${label}`;
}

function getExcerpt(post) {
  if (post.excerpt && post.excerpt.length > 80) return post.excerpt;
  const clean = (post.content || "").replace(/[#*_`>\[\]()]/g, " ").replace(/\s+/g, " ").trim();
  return clean.slice(0, 220) + (clean.length > 220 ? "..." : "");
}

export default function BlogPage() {
  const [posts, setPosts] = useState(allSeoArticles);
  const [filteredPosts, setFilteredPosts] = useState(allSeoArticles);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadPosts();
    checkUser();
  }, []);

  const filterPosts = useCallback(() => {
    let filtered = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await BlogPost.filter({ published: true }, "-created_date", 50);
      const merged = [...data, ...allSeoArticles.filter(staticPost => !data.some(post => post.slug === staticPost.slug))];
      setPosts(merged.length ? merged : allSeoArticles);
    } catch (error) {
      console.error("Error loading posts, using evergreen article fallback:", error);
      setPosts(allSeoArticles);
    }
    setIsLoading(false);
  };

  const categories = allArticleCategories;

  const postDate = (post) => {
    try {
      return new Date(post.created_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "Updated guide";
    }
  };

  const getGuideUrl = (post) => {
    const isStaticGuide = allSeoArticles.some(article => article.slug === post.slug);
    return createPageUrl(isStaticGuide ? "GuidePost" : "BlogPost") + `?slug=${post.slug}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta
        title="Crypto AI Central Blog | Crypto, AI, DeFi, Wallets and Blockchain Guides"
        description="Read practical long-form guides about Bitcoin, DeFi, crypto wallets, stablecoins, exchanges, AI crypto tools, blockchain, AI agents, token creation, regulation and Web3 monetisation."
        keywords="crypto blog, AI crypto tools, DeFi guide, Bitcoin guide, crypto wallets, stablecoins, blockchain education, AI agents, crypto regulation"
      />

      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Badge className="mb-4 bg-blue-600 text-white">Crypto AI Central Editorial Hub</Badge>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mb-5">
            Practical crypto, blockchain and AI guides built for search, trust and monetisation.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl">
            Learn Bitcoin, DeFi, wallets, stablecoins, exchanges, AI agents, token creation, crypto regulation and Web3 automation with clear explanations, risk warnings and useful next steps.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex justify-center"><RotatingBanner bannerType="leaderboard" /></div>
        <div className="mb-8 flex justify-center">
          <GoogleAd adSlot="1234567890" style={{ display: 'block', width: '728px', height: '90px', maxWidth: '100%' }} adFormat="horizontal" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search Bitcoin, DeFi, AI agents, wallets, tokens, regulation..." className="pl-10" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map(category => <SelectItem key={category} value={category}>{category === "all" ? "All categories" : category}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <main>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Latest SEO Guides</h2>
                <p className="text-slate-600">{filteredPosts.length} useful articles available</p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2,3,4].map(item => <div key={item} className="h-80 bg-white rounded-2xl animate-pulse" />)}</div>
            ) : filteredPosts.length === 0 ? (
              <Card><CardContent className="p-10 text-center text-slate-600">No articles found. Try another search.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <Link key={post.slug || post.id} to={getGuideUrl(post)} className="group">
                    <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-slate-200">
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <img src={cardImageUrl(post)} alt={`${post.title} visual guide`} className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                        <Badge className="absolute left-4 bottom-4 bg-blue-600 text-white">{post.category}</Badge>
                      </div>
                      <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                        <div className="flex items-center gap-3 mb-4 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time || Math.ceil((post.content || '').split(' ').length / 200)} min read</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />Long-form guide</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                        <p className="text-slate-600 line-clamp-5 mb-5 flex-1">{getExcerpt(post)}</p>
                        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                          <span className="flex items-center gap-1"><UserIcon className="w-4 h-4" /> {post.author_name || "Editorial Team"}</span>
                          <span className="font-semibold text-blue-600 flex items-center gap-1">Read <ArrowRight className="w-4 h-4" /></span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>

          <aside className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-slate-900">Money-Maker Focus</h3></div>
                <p className="text-sm text-slate-600 mb-4">This content structure supports AdSense, affiliate reviews, comparison pages, newsletter growth and sponsored listings.</p>
                <Link to={createPageUrl("Advertise")}><Button className="w-full">Advertise With Us</Button></Link>
              </CardContent>
            </Card>
            <RotatingBanner bannerType="vertical" />
          </aside>
        </div>
      </div>
    </div>
  );
}
