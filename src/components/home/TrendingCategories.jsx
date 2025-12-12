
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, Bot, Wallet, BarChart3, ArrowRightLeft, Coins, Shield, DollarSign, Building2, CreditCard, FileText, Eye, Zap } from "lucide-react";

const categories = [
  {
    name: "AI Trading Bots",
    description: "Automated trading solutions",
    icon: Bot,
    color: "from-green-500 via-yellow-500 to-emerald-600",
    trending: "+45%"
  },
  {
    name: "Cross-Chain Bridges",
    description: "Multi-chain connectivity",
    icon: Building2,
    color: "from-pink-500 via-purple-500 to-yellow-500",
    trending: "+32%"
  },
  {
    name: "Crypto Wallets",
    description: "Secure storage solutions",
    icon: Wallet,
    color: "from-cyan-500 via-blue-500 to-yellow-500",
    trending: "+54%"
  },
  {
    name: "DeFi Protocols",
    description: "Decentralized finance tools",
    icon: Coins,
    color: "from-orange-500 via-yellow-500 to-amber-600",
    trending: "+89%"
  },
  {
    name: "Layer 2 Scaling Solutions",
    description: "Blockchain scaling infrastructure",
    icon: Shield,
    color: "from-indigo-500 via-blue-500 to-yellow-500",
    trending: "+76%"
  },
  {
    name: "On-Chain Analytics", 
    description: "Blockchain data intelligence",
    icon: BarChart3,
    color: "from-blue-500 via-indigo-500 to-yellow-500",
    trending: "+67%"
  },
  {
    name: "Smart Contract Auditors",
    description: "Security verification services",
    icon: Shield,
    color: "from-purple-500 via-indigo-500 to-yellow-500",
    trending: "+28%"
  }
];

export default function TrendingCategories() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Trending Categories</h2>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          The fastest-growing segments in the AI and crypto space
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={createPageUrl("Category") + `?cat=${encodeURIComponent(category.name)}`}
            className="group block"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {category.trending}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </h3>
              
              <p className="text-slate-600">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
