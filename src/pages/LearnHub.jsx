import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SeoMeta from "../components/shared/SeoMeta";
import GoogleAd from "../components/shared/GoogleAd";
import RotatingBanner from "../components/shared/RotatingBanner";
import { allSeoArticles } from "@/data/allSeoArticles";

function guideUrl(slug) {
  return createPageUrl("GuidePost") + `?slug=${slug}`;
}

const clusters = [
  { title: "Start Here", description: "Bitcoin, wallets, exchanges, NFTs and airdrops.", slugs: ["what-is-bitcoin", "crypto-wallets-guide", "crypto-exchanges-guide", "what-is-an-nft", "what-is-a-crypto-airdrop"] },
  { title: "DeFi and Digital Money", description: "DeFi, stablecoins, CBDCs and portfolio tracking.", slugs: ["what-is-defi", "stablecoins-guide", "what-is-a-cbdc", "portfolio-trackers-explained"] },
  { title: "AI and Research", description: "AI tools, AI agents, research frameworks and research tools.", slugs: ["best-ai-crypto-tools", "what-are-ai-agents", "how-to-research-a-crypto-project", "best-crypto-research-tools"] },
  { title: "Builder and Business", description: "Blockchain basics, token creation, regulation and monetisation.", slugs: ["blockchain-basics", "how-to-create-a-crypto-token", "crypto-law-and-regulation-basics", "affiliate-crypto-tools-guide"] }
];

function findArticle(slug) {
  return allSeoArticles.find((article) => article.slug === slug);
}

export default function LearnHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta
        title="Learn Crypto, Blockchain and AI Tools | Crypto AI Central"
        description="A complete learning hub for Bitcoin, DeFi, wallets, stablecoins, CBDCs, NFTs, AI agents, crypto research, token creation, regulation and Web3 monetisation."
        keywords="learn crypto, blockchain guide, AI crypto tools, DeFi, stablecoins, crypto wallets, AI agents, token creation, crypto regulation"
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
            Follow practical guide paths across crypto basics, DeFi, AI agents, research, token creation, regulation and monetisation.
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
              <h2 className="text-3xl font-bold text-slate-900">Guided Learning Paths</h2>
              <p className="text-slate-600 mt-2">Every card links to a live guide page.</p>
            </div>
            <Link to={createPageUrl("Blog")}><Button variant="outline">View All Guides</Button></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clusters.map((cluster) => (
              <Card key={cluster.title} className="bg-white border-slate-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{cluster.title}</h3>
                  <p className="text-sm text-slate-600 mb-5">{cluster.description}</p>
                  <div className="space-y-3">
                    {cluster.slugs.map((slug) => {
                      const article = findArticle(slug);
                      if (!article) return null;
                      return (
                        <Link key={slug} to={guideUrl(slug)} className="flex items-start gap-2 text-sm text-slate-700 hover:text-blue-600">
                          <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{article.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mb-10 flex justify-center">
          <GoogleAd adSlot="1234567890" style={{ display: "block", width: "728px", height: "90px", maxWidth: "100%" }} adFormat="horizontal" />
        </div>

        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">All Current Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSeoArticles.map((article) => (
              <Link key={article.slug} to={guideUrl(article.slug)}>
                <Card className="h-full bg-white border-slate-200 hover:shadow-xl transition-all">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{article.category}</Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.reading_time} min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 hover:text-blue-600">{article.title}</h3>
                    <p className="text-sm text-slate-600 flex-1">{article.excerpt}</p>
                    <div className="mt-5 text-blue-600 font-semibold text-sm flex items-center gap-2">Read guide <ArrowRight className="w-4 h-4" /></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
