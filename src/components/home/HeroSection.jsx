import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const tagCategoryMapping = {
  "AI Trading": "AI Trading Bots",
  "DeFi": "DeFi Protocols",
  "Wallets": "Crypto Wallets",
  "Exchanges": "Exchanges",
  "Analytics": "On-Chain Analytics"
};

const popularTags = Object.keys(tagCategoryMapping);

export default function HeroSection({ searchQuery, setSearchQuery, onSearch }) {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-yellow-500/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32">
        <div className="text-center w-full">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 md:mb-6">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
            <span className="text-yellow-400 font-semibold text-[9px] sm:text-xs md:text-sm uppercase tracking-wider">
              CRYPTO AND AI CENTRAL
            </span>
          </div>
          
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
            Discover the Best
            <span className="block mt-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-yellow-400 bg-clip-text text-transparent">
              AI & Crypto Tools
            </span>
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-slate-300 mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed max-w-3xl mx-auto px-2 sm:px-4">
            Your guide to AI trading bots, DeFi protocols, wallets, and blockchain infrastructure.
          </p>

          <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-yellow-500 rounded-lg sm:rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative flex flex-col sm:flex-row bg-white rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-2xl gap-2">
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                  className="flex-1 border-0 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 bg-transparent focus:ring-0 text-slate-900 placeholder:text-slate-500" 
                />

                <Button
                  onClick={onSearch}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Button>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 md:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {popularTags.map((tag) => (
                <Link key={tag} to={createPageUrl("Category") + `?cat=${encodeURIComponent(tagCategoryMapping[tag])}`}>
                  <span className="block px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-[9px] sm:text-xs font-medium hover:bg-white/20 transition-colors duration-300 cursor-pointer whitespace-nowrap">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}