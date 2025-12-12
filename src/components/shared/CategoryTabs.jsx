import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categories = [
  "All",
  "AI Content Tools",
  "AI Trading Bots",
  "Banking & Financial Services",
  "Compliance & Regulatory",
  "Cross-Chain Bridges",
  "Crypto Cards",
  "Crypto Tax",
  "Crypto Wallets",
  "Decentralized Identity (DID)",
  "DeFi Protocols",
  "Exchanges",
  "Financial Infrastructure",
  "Institutional Services",
  "Layer 2 Scaling Solutions",
  "Mining Pools",
  "News & Education",
  "NFT Lending Platforms",
  "On-Chain Analytics",
  "Oracles",
  "Payment Processors",
  "Portfolio Trackers",
  "Real World Assets (RWA)",
  "Regulatory/KYC APIs",
  "Restaking Platforms",
  "Smart Contract Auditors",
  "Smart Contract Platforms",
  "Stablecoins & Digital Assets",
  "Staking Platforms",
  "Treasury Management",
  "Yield & Savings Platforms"
];

export default function CategoryTabs({ activeCategory = "All", onCategoryChange, showCounts = false, categoryCounts = {} }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = (direction) => {
    const container = document.getElementById('category-tabs-container');
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);

    // Update scroll button states
    setTimeout(() => {
      setCanScrollLeft(newPosition > 0);
      setCanScrollRight(newPosition < container.scrollWidth - container.clientWidth);
    }, 300);
  };

  const getCategoryUrl = (category) => {
    if (category === "All") {
      return createPageUrl("Browse");
    }
    return createPageUrl("Category") + `?cat=${encodeURIComponent(category)}`;
  };

  return (
    <div className="relative bg-white border-b border-slate-200 py-2 sm:py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Scroll Left Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="hidden sm:flex flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>

          {/* Tabs Container */}
          <div 
            id="category-tabs-container"
            className="flex-1 overflow-x-auto scrollbar-hide -mx-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-1.5 sm:gap-2 min-w-max px-1">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                const count = categoryCounts[category] || 0;
                
                if (onCategoryChange) {
                  // If onCategoryChange is provided, render as buttons
                  return (
                    <Button
                      key={category}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => onCategoryChange(category)}
                      className={`whitespace-nowrap flex-shrink-0 transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 h-auto ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate max-w-[120px] sm:max-w-none">{category}</span>
                      {showCounts && count > 0 && (
                        <Badge variant="secondary" className="ml-1 sm:ml-2 text-[8px] sm:text-xs px-1 sm:px-1.5 h-4 sm:h-5">
                          {count}
                        </Badge>
                      )}
                    </Button>
                  );
                } else {
                  // Otherwise, render as links
                  return (
                    <Link
                      key={category}
                      to={getCategoryUrl(category)}
                      className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 flex items-center gap-1 sm:gap-2 ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate max-w-[120px] sm:max-w-none">{category}</span>
                      {showCounts && count > 0 && (
                        <Badge variant="secondary" className="text-[8px] sm:text-xs px-1 sm:px-1.5 h-4 sm:h-5">
                          {count}
                        </Badge>
                      )}
                    </Link>
                  );
                }
              })}
            </div>
          </div>

          {/* Scroll Right Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className="hidden sm:flex flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}