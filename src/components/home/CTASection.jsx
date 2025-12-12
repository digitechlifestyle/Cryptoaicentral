import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Plus, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* For Users */}
          <div className="text-center lg:text-left">
            <Sparkles className="w-12 h-12 mb-4 mx-auto lg:mx-0" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Exploring Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands discovering the best AI and crypto tools. Free forever, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={createPageUrl("Browse")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                  Browse All Tools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Featured")}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  View Featured
                </Button>
              </Link>
            </div>
          </div>

          {/* For Project Owners */}
          <div className="text-center lg:text-left bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <Plus className="w-12 h-12 mb-4 mx-auto lg:mx-0" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              List Your Project
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Get your AI tool or crypto protocol in front of 10,000+ monthly users. Free basic listing included.
            </p>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Free basic listing forever</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Featured placement options</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>SEO benefits and backlinks</span>
              </li>
            </ul>
            <Link to={createPageUrl("AddListing")}>
              <Button size="lg" className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 w-full">
                Submit Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}