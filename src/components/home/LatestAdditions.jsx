import React from "react";
import { Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestAdditions({ listings, isLoading }) {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-blue-500" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Latest Additions</h2>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Newly added projects and platforms in the directory
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              {listing.logo_url && (
                <div className="h-48 overflow-hidden flex-shrink-0">
                  <img 
                    src={listing.logo_url} 
                    alt={`${listing.name} logo`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary" className="whitespace-nowrap text-xs">{listing.category}</Badge>
                  {listing.featured && (
                    <Badge className="bg-blue-100 text-blue-700 whitespace-nowrap text-xs">Featured</Badge>
                  )}
                </div>
                
                <Link to={createPageUrl("Project") + `?id=${listing.id}`} className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {listing.name}
                  </h3>
                </Link>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                  {listing.description}
                </p>
                
                {listing.tags && listing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {listing.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <Link to={createPageUrl("Project") + `?id=${listing.id}`}>
                  <Button className="w-full" size="sm">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link to={createPageUrl("Browse")}>
          <Button variant="outline" size="lg" className="hover:bg-slate-50">
            Browse All Projects
          </Button>
        </Link>
      </div>
    </section>
  );
}