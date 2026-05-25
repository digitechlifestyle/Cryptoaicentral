import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BookOpen,
  TrendingUp,
  Shield,
  GraduationCap,
  Clock,
  ArrowRight,
  Wallet,
  Coins,
  Bot,
  Landmark,
  Building2,
  Search
} from "lucide-react";
import SeoMeta from "../components/shared/SeoMeta";
import GoogleAd from "../components/shared/GoogleAd";
import RotatingBanner from "../components/shared/RotatingBanner";
import { evergreenArticles } from "@/data/seoArticles";

const learningPaths = [
  {
    id: "beginner",
    title: "Crypto Basics",
    description: "Start with Bitcoin, wallets, exchanges and basic digital asset safety.",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-600",
    links: ["what-is-bitcoin", "crypto-wallets-guide", "crypto-exchanges-guide"]
  },
  {
    id: "defi",
    title: "DeFi & Stablecoins",
    description: "Understand decentralized finance, stablecoins, yield, risks and protocols.",
    icon: Coins,
    color: "from-blue-500 to-indigo-600",
    links: ["what-is-defi", "stablecoins-guide"]
  },
  {
    id: "ai-tools",
    title: "AI + Crypto Tools",
    description: "Learn how AI tools support trading, research, analytics and automation.",
    icon: Bot,
    color: "from-purple-500 to-pink-600",
    links: ["best-ai-crypto-tools"]
  },
  {
    id: "security",
    title: "Security & Risk",
    description: "Protect your wallets, avoid scams and learn safe research habits.",
    icon: Shield,
    color: "from-red-500 to-orange-600",
    links: ["crypto-wallets-guide", "what-is-defi", "best-ai-crypto-tools"]
  }
];

const upcomingGuides = [
  { title: "What Is a CBDC?", icon: Landmark, category: "CBDC" },
  { title: "What Is an NFT?", icon: BookOpen, category: "NFTs" },
  { title: "What Is an Airdrop?", icon: TrendingUp, category: "Crypto Basics" },
  { title: "How to Research a Crypto Project", icon: Search, category: "Research" },
  { title: "Crypto Tax Basics", icon: Building2, category: "Tax" },
  { title: "Hardware Wallets vs Software Wallets", icon: Wallet, category: "Wallets" }
];

function getArticle(slug) {
  return evergreenArticles.find(article => article.slug === slug);
}

function articleUrl(slug) {
  return createPageUrl("BlogPost") + `?slug=${slug}`;
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta
        title="Learn Crypto, Blockchain and AI Tools | Crypto AI Central"
        description="Start learning Bitcoin, DeFi, crypto wallets, stablecoins, exchanges, AI crypto tools, blockchain safety and Web3 finance with beginner-friendly guides."
        keywords="learn crypto, crypto guide, blockchain education, AI crypto tools, DeFi guide, wallet security, stablecoins, exchanges"
      />

      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-5">
            <BookOpen className="w-9 h-9 text-blue-400" />
            <Badge className="bg-blue-600 text-white">Learning Hub</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mb-5">
            Learn crypto, blockchain and AI tools without the hype.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl">
            Follow structured guides designed for beginners, builders and investors who want clear explanations, practical steps and risk-aware decisions.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex justify-center">
          <RotatingBanner bannerType="leaderboard" />
        </div>

        <section className="mb-12">
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Start With a Learning Path</h2>
              <p className="text-slate-600 mt-2">Each path links to real long-form guides, not dead cards.</p>
            </div>
            <Link to={createPageUrl("Blog")}>
              <Button variant="outline">View All Guides</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path) => {
              const IconComponent = path.icon;
              return (
                <Card key={path.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border-slate-200">
                  <div className={`h-2 bg-gradient-to-r ${path.color}`} />
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${path.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">{path.title}</h3>
                    <p className="text-slate-600 text-sm mb-5">{path.description}</p>
                    <div className="space-y-3 flex-1">
                      {path.links.map((slug) => {
                        const article = getArticle(slug);
                        if (!article) return null;
                        return (
                          <Link key={slug} to={articleUrl(slug)} className="flex items-start gap-2 text-sm text-slate-700 hover:text-blue-600 transition-colors">
                            <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>{article.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="mb-10 flex justify-center">
          <GoogleAd
            adSlot="1234567890"
            style={{ display: 'block', width: '728px', height: '90px', maxWidth: '100%' }}
            adFormat="horizontal"
          />
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Core Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evergreenArticles.map((article) => (
              <Link key={article.slug} to={articleUrl(article.slug)}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white border-slate-200">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{article.category}</Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.reading_time} min read
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 hover:text-blue-600 transition-colors">{article.title}</h3>
                    <p className="text-slate-600 text-sm flex-1">{article.excerpt}</p>
                    <div className="mt-5 text-blue-600 font-semibold text-sm flex items-center gap-2">
                      Read guide <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Next Guides to Add</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingGuides.map((guide) => {
              const IconComponent = guide.icon;
              return (
                <Card key={guide.title} className="bg-white border-dashed border-slate-300">
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">{guide.category}</Badge>
                      <h3 className="font-bold text-slate-900">{guide.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">Planned SEO guide for the next content batch.</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-4">Quick Safety Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🔐 Never share private keys</h4>
                <p className="text-sm opacity-90">Your seed phrase controls your wallet. No real support team will ask for it.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Start small</h4>
                <p className="text-sm opacity-90">Test wallets, exchanges and tools with small amounts before scaling up.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Research first</h4>
                <p className="text-sm opacity-90">Compare sources, check risks and avoid guaranteed-profit claims.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
