import React from "react";
import { Star, ExternalLink, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ListingCard from "../shared/ListingCard";

export default function FeaturedSection({ listings, isLoading }) {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Featured Projects</h2>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Hand-picked selections of the most innovative and trusted platforms in the space
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <Skeleton className="h-16 w-16 rounded-[18px]" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-blue-500 to-indigo-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative">
                <ListingCard listing={listing} featured={true} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center">
        <Link to={createPageUrl("Featured")}>
          <Button variant="outline" size="lg" className="hover:bg-slate-50">
            View All Featured Projects
          </Button>
        </Link>
      </div>
    </section>
  );
}