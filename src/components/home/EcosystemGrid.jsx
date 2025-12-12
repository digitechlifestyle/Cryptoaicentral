
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight, BarChart3, Bot, Wallet, ArrowRightLeft, Coins, Shield, DollarSign, Building2, CreditCard, Layers, FileText, Eye, Zap, Network } from "lucide-react";

const ecosystemCategories = [
  { name: "AI Trading Bots", icon: Bot, color: "text-cyan-500" },
  { name: "Cross-Chain Bridges", icon: Building2, color: "text-pink-500" },
  { name: "Crypto Cards", icon: CreditCard, color: "text-green-600" },
  { name: "Crypto Tax", icon: FileText, color: "text-orange-600" },
  { name: "Crypto Wallets", icon: Wallet, color: "text-blue-500" },
  { name: "Decentralized Identity (DID)", icon: FileText, color: "text-purple-600" },
  { name: "DeFi Protocols", icon: Coins, color: "text-orange-500" },
  { name: "Exchanges", icon: ArrowRightLeft, color: "text-green-500" },
  { name: "Layer 2 Scaling Solutions", icon: Network, color: "text-indigo-500" },
  { name: "On-Chain Analytics", icon: BarChart3, color: "text-purple-500" },
  { name: "Oracles", icon: Zap, color: "text-yellow-500" },
  { name: "Portfolio Trackers", icon: Eye, color: "text-green-500" },
  { name: "Regulatory/KYC APIs", icon: Shield, color: "text-gray-500" },
  { name: "Restaking Platforms", icon: Layers, color: "text-blue-600" },
  { name: "Smart Contract Auditors", icon: Shield, color: "text-red-500" },
  { name: "Smart Contract Platforms", icon: CreditCard, color: "text-emerald-500" },
  { name: "Staking Platforms", icon: Layers, color: "text-teal-500" }
];

export default function EcosystemGrid() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Explore by Category
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Discover tools and protocols across various blockchain categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ecosystemCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.name}
              to={createPageUrl("Category") + `?cat=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover border border-slate-100">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {IconComponent && <IconComponent className={`w-7 h-7 ${category.color}`} />}
                </div>
                
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
