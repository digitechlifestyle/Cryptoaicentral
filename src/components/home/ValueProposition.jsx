import React from "react";
import { Shield, Zap, Globe, Users, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ValueProposition() {
  const features = [
    {
      icon: Shield,
      title: "Thoroughly Vetted",
      description: "Every project undergoes comprehensive security audits and team verification before listing"
    },
    {
      icon: Zap,
      title: "Always Updated",
      description: "Real-time updates on new protocols, regulatory changes, and market developments"
    },
    {
      icon: Globe,
      title: "Multi-Chain Coverage",
      description: "Discover tools across Ethereum, Solana, Bitcoin, and 15+ other blockchains"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Trusted reviews and ratings from thousands of active crypto users"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Value Prop */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Your Trusted Gateway to Web3
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Crypto AI Central is the comprehensive directory connecting developers, traders, and institutions 
            with verified AI tools and blockchain infrastructure. We cut through the noise to help you find 
            the right solutions for your needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-slate-600">Verified Projects</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
            <div className="text-slate-600">Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
            <div className="text-slate-600">Blockchains</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-slate-600">Monthly Users</div>
          </div>
        </div>
      </div>
    </section>
  );
}