import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Bot, Coins, ShieldCheck, TrendingUp, Wallet, BarChart3, BadgeDollarSign, Search } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SeoMeta from "../components/shared/SeoMeta";
import GoogleAd from "../components/shared/GoogleAd";
import { allSeoArticles } from "@/data/allSeoArticles";

const categories = [
  { title: "Crypto Basics", icon: Coins, text: "Bitcoin, blockchain, wallets, airdrops and beginner safety.", slug: "what-is-bitcoin" },
  { title: "AI Crypto Tools", icon: Bot, text: "AI agents, market research, automation and AI-supported workflows.", slug: "best-ai-crypto-tools" },
  { title: "Wallets & Security", icon: Wallet, text: "Hardware wallets, software wallets, seed phrases and self-custody.", slug: "crypto-wallets-guide" },
  { title: "DeFi & Stablecoins", icon: TrendingUp, text: "DeFi protocols, stablecoins, CBDCs and portfolio risk.", slug: "what-is-defi" },
  { title: "Research & Analytics", icon: Search, text: "On-chain data, research checklists, project reviews and red flags.", slug: "how-to-research-a-crypto-project" },
  { title: "Regulation & Tax", icon: ShieldCheck, text: "Crypto tax basics, law, compliance and record keeping.", slug: "crypto-tax-basics" }
];

const moneyBlocks = [
  { title: "Best Crypto Wallets", copy: "Compare hardware, mobile and browser wallets by security, convenience and use case." },
  { title: "Best AI Crypto Tools", copy: "Compare AI research tools, market monitors and automation systems without hype." },
  { title: "Best Crypto Exchanges", copy: "Understand fees, custody, liquidity, regulation and beginner safety." },
  { title: "Crypto Tax Tools", copy: "Plan record keeping, exports and tax software comparison pages for affiliate revenue." }
];

function guideUrl(slug) {
  return createPageUrl("GuidePost") + `?slug=${slug}`;
}

function VisualCard({ label, icon: Icon }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/30 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-amber-400/20 blur-2xl" />
      <div className="relative">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
          <Icon className="h-7 w-7" />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Crypto AI Central</p>
        <h3 className="mt-2 text-2xl font-black text-white">{label}</h3>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="h-16 rounded-2xl bg-white/20" />
          <div className="h-16 rounded-2xl bg-white/10" />
          <div className="h-16 rounded-2xl bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const featuredGuides = allSeoArticles.slice(0, 9);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SeoMeta
        title="Crypto AI Central | Crypto, AI Tools, Blockchain and Web3 Guides"
        description="Learn crypto, AI agents, wallets, DeFi, stablecoins, exchanges, blockchain tools and Web3 monetisation through practical guides and comparison pages."
        keywords="crypto AI, AI crypto tools, Bitcoin guide, DeFi, crypto wallets, blockchain, Web3 tools, crypto comparison"
      />

      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.25),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Badge className="mb-5 bg-blue-600 text-white">Crypto + AI Education Hub</Badge>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Learn crypto, AI tools and Web3 without thin content or hype.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Crypto AI Central is being built as a profitable authority site with guides, comparison pages, affiliate-ready sections, AdSense placements and practical beginner education.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={createPageUrl("Learn")}><Button size="lg" className="bg-blue-600 hover:bg-blue-700">Start Learning <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
              <Link to={createPageUrl("Blog")}><Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">Read Guides</Button></Link>
            </div>
          </div>
          <VisualCard label="Guides, tools and comparisons" icon={BarChart3} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {["20 SEO guide topics", "AI + crypto focus", "Affiliate-ready structure", "AdSense-ready layout"].map((stat) => (
            <div key={stat} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center font-bold text-slate-100">{stat}</div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <Badge className="mb-3 bg-emerald-600 text-white">Main Categories</Badge>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Explore the profitable content pillars</h2>
            </div>
            <Link to={createPageUrl("Learn")}><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">View Learning Hub</Button></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.title} to={guideUrl(category.slug)}>
                  <Card className="h-full border-white/10 bg-white/10 text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.14]">
                    <CardContent className="p-6">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600"><Icon className="h-6 w-6" /></div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                      <p className="mt-3 text-sm text-slate-300">{category.text}</p>
                      <div className="mt-5 flex items-center text-sm font-semibold text-blue-300">Open guide <ArrowRight className="ml-2 h-4 w-4" /></div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Badge className="mb-3 bg-amber-500 text-slate-950">Money Pages</Badge>
            <h2 className="text-3xl font-black text-white sm:text-4xl">Affiliate and comparison sections</h2>
            <p className="mt-3 max-w-3xl text-slate-300">These blocks are designed to become review/comparison pages once approved affiliate partners and real product screenshots are added.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {moneyBlocks.map((block) => (
              <Card key={block.title} className="border-white/10 bg-white text-slate-950">
                <CardContent className="p-6">
                  <BadgeDollarSign className="mb-4 h-8 w-8 text-emerald-600" />
                  <h3 className="text-xl font-black">{block.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{block.copy}</p>
                  <Button className="mt-5 w-full" variant="outline">Comparison coming soon</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <Badge className="mb-3 bg-blue-600 text-white">Latest Guides</Badge>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Start reading now</h2>
            </div>
            <Link to={createPageUrl("Blog")}><Button className="bg-blue-600 hover:bg-blue-700">All Guides</Button></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredGuides.map((article) => (
              <Link key={article.slug} to={guideUrl(article.slug)}>
                <Card className="h-full border-white/10 bg-white/10 text-white transition hover:bg-white/[0.14]">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{article.category}</Badge>
                      <span className="text-xs text-slate-400">{article.reading_time} min</span>
                    </div>
                    <h3 className="text-xl font-bold">{article.title}</h3>
                    <p className="mt-3 flex-1 text-sm text-slate-300">{article.excerpt}</p>
                    <div className="mt-5 flex items-center text-sm font-semibold text-blue-300"><BookOpen className="mr-2 h-4 w-4" /> Read guide</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 text-slate-950 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black">AdSense and affiliate space</h2>
          <p className="mt-3 text-slate-600">This area is reserved for compliant ad placements, newsletter capture and partner comparison CTAs.</p>
          <div className="mt-6 flex justify-center"><GoogleAd adSlot="1234567890" style={{ display: "block", width: "728px", height: "90px", maxWidth: "100%" }} adFormat="horizontal" /></div>
        </div>
      </section>
    </div>
  );
}
