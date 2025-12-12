
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const filterOptions = {
  category: [
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
  ],
  chain: [
    "Arbitrum", "Avalanche", "Base", "BNB Chain", "Bitcoin", "Cardano", 
    "Cosmos", "Ethereum", "Hedera", "Multichain", "Off-chain", "Optimism", 
    "Polkadot", "Solana", "Stellar", "TON", "XDC Network", "XRP Ledger", "zkSync"
  ],
  type: [
    "Analytics Platform", "Audit", "Bridge", "Browser Wallet", "Centralized Exchange", 
    "Credit Card", "Debit Card", "Decentralized Exchange", "DEX Aggregator", 
    "DID", "Hardware Wallet", "KYC/AML", "Layer 2", "Lending", "Liquid Staking", 
    "Mobile Wallet", "Network", "Oracle Network", "Perpetuals DEX", "Portfolio Tracker", 
    "Prepaid Card", "Restaking", "Stablecoin DEX", "Staking Platform", "Tax Software", 
    "Trading Bot"
  ],
  risk: ["High", "Low", "Medium"],
  kyc_required: ["No", "Yes"],
  pricing: [
    "Annual fee", "Free", "Freemium", "Hardware purchase", "Monthly fee", 
    "No annual fee", "Protocol fees", "Subscription", "Trading fees"
  ]
};

export default function FilterSidebar({ filters, onFilterChange, onClearFilters, totalResults }) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sticky top-4 sm:top-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-600 hover:text-slate-800 text-xs"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All categories</SelectItem>
              {filterOptions.category.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chain Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Blockchain
          </label>
          <Select value={filters.chain} onValueChange={(value) => onFilterChange('chain', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All chains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All chains</SelectItem>
              {filterOptions.chain.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Type
          </label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All types</SelectItem>
              {filterOptions.type.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Risk Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Risk Level
          </label>
          <Select value={filters.risk} onValueChange={(value) => onFilterChange('risk', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All risk levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All risk levels</SelectItem>
              {filterOptions.risk.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KYC Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            KYC Required
          </label>
          <Select value={filters.kyc_required} onValueChange={(value) => onFilterChange('kyc_required', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Any</SelectItem>
              {filterOptions.kyc_required.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
            Pricing
          </label>
          <Select value={filters.pricing} onValueChange={(value) => onFilterChange('pricing', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="All pricing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All pricing</SelectItem>
              {filterOptions.pricing.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50 rounded-lg">
        <p className="text-xs sm:text-sm text-slate-600 text-center">
          <span className="font-semibold text-slate-900">{totalResults}</span> projects match your filters
        </p>
      </div>
    </div>
  );
}
