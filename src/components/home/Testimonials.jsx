import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "DeFi Trader",
      avatar: "SC",
      content: "Crypto AI Central helped me discover secure DeFi protocols I would have never found on my own. The verification badges give me confidence.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Smart Contract Developer",
      avatar: "MR",
      content: "As a developer, I need reliable infrastructure. This directory saved me weeks of research finding the right oracle and analytics solutions.",
      rating: 5
    },
    {
      name: "Emily Thompson",
      role: "Crypto Consultant",
      avatar: "ET",
      content: "I recommend Crypto AI Central to all my clients. It's the most comprehensive and trustworthy resource for navigating the crypto ecosystem.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-slate-600">
            See what the community says about us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-blue-200 mb-4" />
                
                <p className="text-slate-700 mb-6 leading-relaxed">
                  {testimonial.content}
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}