import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-[18px] flex-shrink-0" />
            <div className="flex-1 min-w-0">
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
      ))}
    </div>
  );
}