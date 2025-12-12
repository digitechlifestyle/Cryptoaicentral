
import React, { useState, useEffect } from 'react';
import { DirectoryListing } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign } from 'lucide-react';

export default function RotatingBanner({ bannerType }) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        const bannerData = await DirectoryListing.filter({
          status: 'approved',
          banner_type: bannerType
        });
        // Filter out any banners that might not have an image URL
        setBanners(bannerData.filter(b => b.banner_image_url));
      } catch (error) {
        console.error(`Failed to fetch ${bannerType} banners:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [bannerType]);

  useEffect(() => {
    if (banners.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
      }, 5000); // Rotate every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [banners.length]);

  const bannerStyles = {
    leaderboard: 'w-[728px] h-[90px] max-w-full',
    rectangle: 'w-full h-64 md:w-[300px] md:h-[250px]',
    mobile: 'w-[320px] h-[50px] max-w-full',
    vertical: 'w-[300px] h-[600px] max-w-full',
  };

  const currentBanner = banners[currentIndex];

  if (isLoading) {
    return <Skeleton className={`rounded-lg ${bannerStyles[bannerType] || 'h-64'}`} />;
  }

  if (banners.length === 0) {
    return (
      <div className={`w-full bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4 ${bannerStyles[bannerType] || 'h-64'}`}>
        <DollarSign className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-slate-500 font-semibold text-sm">Advertisement</p>
        <p className="text-slate-400 text-xs text-center mt-1">
          Ad slot available
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${bannerStyles[bannerType] || 'h-64'}`}>
      {banners.map((banner, index) => (
        <a
          key={banner.id}
          href={banner.website}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={banner.banner_image_url}
            alt={`${banner.name} advertisement`}
            className="w-full h-full object-cover rounded-lg"
          />
        </a>
      ))}
    </div>
  );
}
