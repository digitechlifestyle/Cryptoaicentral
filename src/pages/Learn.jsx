
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, Video, FileText, TrendingUp, Shield, 
  Code, Zap, GraduationCap, Clock, ArrowRight, BarChart 
} from "lucide-react";

const learningPaths = [
  {
    id: "beginner",
    title: "Beginner's Guide",
    description: "Start your crypto journey here",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-600",
    topics: [
      "What is Cryptocurrency?",
      "How to Buy Your First Crypto",
      "Understanding Wallets",
      "Basic Security Practices"
    ]
  },
  {
    id: "defi",
    title: "DeFi Essentials",
    description: "Master decentralized finance",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-600",
    topics: [
      "Understanding DeFi Protocols",
      "Yield Farming Strategies",
      "Liquidity Pools Explained",
      "Risk Management in DeFi"
    ]
  },
  {
    id: "trading",
    title: "Trading & Analysis",
    description: "Learn to trade like a pro",
    icon: BarChart,
    color: "from-purple-500 to-pink-600",
    topics: [
      "Technical Analysis Basics",
      "Using Trading Bots",
      "Market Psychology",
      "Risk Management"
    ]
  },
  {
    id: "security",
    title: "Security Best Practices",
    description: "Protect your assets",
    icon: Shield,
    color: "from-red-500 to-orange-600",
    topics: [
      "Hardware Wallet Setup",
      "Avoiding Scams",
      "2FA and Account Security",
      "Smart Contract Risks"
    ]
  }
];

export default function LearnPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await base44.entities.BlogPost.filter(
        { published: true },
        "-created_date",
        20
      );
      setArticles(data);
    } catch (error) {
      console.error("Failed to load articles:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Learn Center
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Master cryptocurrency, DeFi, and blockchain technology with our comprehensive guides
          </p>
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path) => {
              const IconComponent = path.icon;
              return (
                <Card key={path.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className={`h-2 bg-gradient-to-r ${path.color}`} />
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${path.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{path.description}</p>
                    <ul className="space-y-2 mb-6">
                      {path.topics.map((topic, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant="outline">
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Latest Articles */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Latest Articles</h2>
            <Link to={createPageUrl("Blog")}>
              <Button variant="outline">View All Articles</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article) => (
              <Link key={article.id} to={createPageUrl("BlogPost") + `?slug=${article.slug}`}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                  {article.featured_image && (
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>{article.category}</Badge>
                      {article.reading_time && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.reading_time} min read
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6" />
              <h3 className="text-2xl font-bold">Quick Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🔐 Never Share Private Keys</h4>
                <p className="text-sm opacity-90">Your private keys are like your bank password. Never share them with anyone.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Start Small</h4>
                <p className="text-sm opacity-90">Begin with small amounts while learning. Practice makes perfect.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Do Your Research</h4>
                <p className="text-sm opacity-90">Always research projects thoroughly before investing. DYOR (Do Your Own Research).</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
