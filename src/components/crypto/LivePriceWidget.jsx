import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { base44 } from "@/api/base44Client";

const POPULAR_CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "ADA", name: "Cardano" }
];

export default function LivePriceWidget() {
  const [prices, setPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      // Use the InvokeLLM integration to fetch live crypto prices
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current prices for these cryptocurrencies: ${POPULAR_CRYPTOS.map(c => c.symbol).join(', ')}. 
                 Return the current price in USD and 24h change percentage for each.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            prices: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  price_usd: { type: "number" },
                  change_24h: { type: "number" }
                }
              }
            }
          }
        }
      });

      const priceData = {};
      response.prices.forEach(p => {
        priceData[p.symbol] = {
          price: p.price_usd,
          change: p.change_24h
        };
      });
      
      setPrices(priceData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Live Prices</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {POPULAR_CRYPTOS.map((crypto) => {
            const priceData = prices[crypto.symbol];
            const isPositive = priceData?.change >= 0;

            return (
              <div key={crypto.symbol} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs opacity-80 mb-1">{crypto.name}</div>
                <div className="font-bold text-lg mb-1">
                  {isLoading ? (
                    <div className="h-6 bg-white/20 rounded animate-pulse" />
                  ) : (
                    formatPrice(priceData?.price || 0)
                  )}
                </div>
                <div className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                  {isLoading ? (
                    <div className="h-4 w-12 bg-white/20 rounded animate-pulse" />
                  ) : (
                    <>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(priceData?.change || 0).toFixed(2)}%
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs opacity-60 mt-4 text-center">
          Updated every minute • Powered by live market data
        </p>
      </CardContent>
    </Card>
  );
}