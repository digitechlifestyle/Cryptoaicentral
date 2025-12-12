import React from "react";
import ListingCard from "../shared/ListingCard";
import LoadingGrid from "../shared/LoadingGrid";

export default function ListingGrid({ listings, isLoading }) {
  if (isLoading) {
    return <LoadingGrid count={12} />;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No projects found</h3>
        <p className="text-slate-600">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}