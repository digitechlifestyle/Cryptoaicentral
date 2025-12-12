import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle } from "lucide-react";
import OptimizedImage from "../shared/OptimizedImage";

export default function ShowcaseExamples() {
  const examples = [
    {
      name: "Uniswap",
      category: "DeFi Protocols",
      description: "Leading decentralized exchange with $4B+ in daily volume",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
      verified: true,
      tags: ["DEX", "Ethereum", "AMM"]
    },
    {
      name: "Ledger",
      category: "Crypto Wallets",
      description: "Hardware wallet securing $300B+ in crypto assets",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop",
      verified: true,
      tags: ["Hardware", "Security", "Multi-chain"]
    },
    {
      name: "Dune Analytics",
      category: "On-Chain Analytics",
      description: "Comprehensive blockchain data and visualization platform",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      verified: true,
      tags: ["Analytics", "Data", "Dashboard"]
    }
  ];

  return (
    <section className="py-16" aria-labelledby="showcase-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 id="showcase-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Featured Success Stories
          </h2>
          <p className="text-xl text-slate-600">
            Industry leaders trust and recommend our directory
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <OptimizedImage
                  src={example.image}
                  alt={`${example.name} - ${example.category} platform showcase`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  width={400}
                  height={300}
                />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{example.name}</h3>
                  {example.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" aria-label="Verified project" />
                  )}
                </div>
                
                <Badge className="mb-3">{example.category}</Badge>
                
                <p className="text-slate-600 mb-4 text-sm">
                  {example.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {example.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Listing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}