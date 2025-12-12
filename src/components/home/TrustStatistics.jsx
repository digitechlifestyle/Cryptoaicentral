import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Users, Star, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ icon: Icon, value, label, isLoading }) => (
  <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-4 w-28" />
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-sm font-medium text-slate-600">{label}</p>
          </>
        )}
      </div>
    </div>
  </div>
);

export default function TrustStatistics() {
  const [stats, setStats] = useState({
    verifiedProjects: 0,
    userCount: 0,
    reviews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, users, reviews] = await Promise.all([
          base44.entities.DirectoryListing.filter({ status: 'approved' }).catch(() => []),
          base44.entities.User.list().catch(() => []),
          base44.entities.Review.list().catch(() => []),
        ]);
        setStats({
          verifiedProjects: projects.length,
          userCount: users.length,
          reviews: reviews.length,
        });
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">A Directory Built on Trust</h2>
            <p className="mt-4 text-xl text-slate-600">Our platform's growth and credibility, shown in numbers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            icon={ShieldCheck}
            value={stats.verifiedProjects}
            label="Verified Projects"
            isLoading={isLoading}
          />
          <StatCard 
            icon={Users}
            value={stats.userCount}
            label="Registered Users"
            isLoading={isLoading}
          />
          <StatCard 
            icon={Star}
            value={stats.reviews}
            label="Community Reviews"
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}