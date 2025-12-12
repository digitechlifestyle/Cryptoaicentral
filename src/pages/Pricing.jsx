
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Star, Zap, Eye, Smartphone, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const tiers = [
  {
    name: 'Basic',
    price: '$0',
    frequency: '/ forever',
    description: 'Get your project listed in our directory for free.',
    features: [
      'Standard listing in relevant categories',
      'Appear in search results',
      'Community and admin review',
      'Basic project profile page',
    ],
    cta: 'Start for Free',
    tier: 'basic',
    featured: false,
    icon: Check,
  },
  {
    name: 'Featured',
    price: '$99',
    frequency: '/ year',
    description: 'Enhanced visibility with featured placement.',
    features: [
      'All Basic features',
      'Featured on the homepage',
      'Pinned to the top of your category',
      '"Featured" badge on your listing',
      'Priority in search results',
    ],
    cta: 'Choose Featured',
    tier: 'featured',
    featured: true,
    icon: Star,
  },
  {
    name: 'Sponsored',
    price: '$199',
    frequency: '/ year',
    description: 'Maximum exposure and premium placement.',
    features: [
      'All Featured features',
      '"Sponsored" badge on your listing',
      'Top ranking in all searches',
      'Dedicated promotion opportunities',
      'Enhanced project profile',
      'Year 2: $249.99 (subject to change)',
    ],
    cta: 'Go Sponsored',
    tier: 'sponsored',
    featured: false,
    icon: Zap,
  },
];

const bannerTiers = [
  {
    name: 'Leaderboard Banner',
    size: '728x90',
    price: '$199',
    frequency: '/ year',
    description: 'Premium banner placement at the top of pages.',
    features: [
      'Web standard 728x90 banner size',
      'Displayed on homepage and category pages',
      'High visibility above-the-fold placement',
      'Compatible with all devices',
      'Monthly performance reports',
    ],
    cta: 'Get Leaderboard',
    tier: 'leaderboard_banner',
    icon: Eye,
    placement: 'Top of pages',
  },
  {
    name: 'Vertical Banner',
    size: '300x600',
    price: '$249',
    frequency: '/ year',
    description: 'High-impact vertical banner for sidebar placement.',
    features: [
      'IAB standard 300x600 "Half Page" ad',
      'Exclusive sidebar placement on all pages',
      'Guaranteed visibility on desktop',
      'High engagement format',
      'Monthly performance reports',
    ],
    cta: 'Get Vertical',
    tier: 'vertical_banner',
    icon: TrendingUp,
    placement: 'Main Sidebar',
  },
  {
    name: 'Rectangle Banner',
    size: '300x250',
    price: '$99',
    frequency: '/ year', 
    description: 'Versatile banner for sidebar and in-content placement.',
    features: [
      'Web standard 300x250 banner size',
      'Sidebar and in-content placement',
      'Appears on project detail pages',
      'Mobile and desktop optimized',
      'Contextual targeting available',
    ],
    cta: 'Get Rectangle',
    tier: 'rectangle_banner',
    icon: ArrowRight,
    placement: 'Sidebar & Content',
  },
  {
    name: 'Mobile Banner',
    size: '320x50',
    price: '$49',
    frequency: '/ year',
    description: 'Mobile-optimized banner for mobile users.',
    features: [
      'Web standard 320x50 banner size', 
      'Mobile-first placement strategy',
      'Appears on mobile browsing',
      'Lightweight and fast loading',
      'Mobile user analytics',
    ],
    cta: 'Get Mobile',
    tier: 'mobile_banner',
    icon: Smartphone,
    placement: 'Mobile Only',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">Pricing</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Affordable Plans for Everyone
          </h2>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
          Get your project in front of thousands of developers, traders, and crypto enthusiasts with our competitive pricing.
        </p>

        {/* Directory Listing Tiers */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">Directory Listings</h3>
          <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 ring-1 xl:p-10 ${
                  tier.featured ? 'ring-2 ring-blue-600 relative' : 'ring-slate-200'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <tier.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold leading-8 text-slate-900">{tier.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{tier.price}</span>
                  <span className="text-sm font-semibold leading-6 text-slate-600">{tier.frequency}</span>
                </p>
                <Link
                  to={createPageUrl("AddListing") + `?tier=${tier.tier}`}
                  className={`mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    tier.featured
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600'
                      : 'bg-white text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300 focus-visible:outline-blue-600'
                  }`}
                >
                  {tier.cta} <span aria-hidden="true">→</span>
                </Link>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 xl:mt-10">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Advertising Tiers */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Banner Advertising</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Web standards-compliant banner ads for maximum visibility and engagement. All sizes are IAB standard formats.
            </p>
          </div>
          <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {bannerTiers.map((banner) => (
              <div
                key={banner.name}
                className="rounded-3xl p-8 ring-1 ring-slate-200 xl:p-10 hover:ring-blue-300 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <banner.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-8 text-slate-900">{banner.name}</h3>
                    <p className="text-xs text-slate-500">{banner.size} • {banner.placement}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{banner.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{banner.price}</span>
                  <span className="text-sm font-semibold leading-6 text-slate-600">{banner.frequency}</span>
                </p>
                <Link
                  to={createPageUrl("AddListing") + `?tier=${banner.tier}`}
                  className="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {banner.cta} <span aria-hidden="true">→</span>
                </Link>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 xl:mt-10">
                  {banner.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center text-slate-600">
          <p className="mb-2">For paid tiers, our team will contact you for payment after you submit your listing for review.</p>
          <p className="text-sm">All banner ads must comply with web standards and our content guidelines.</p>
          <p className="text-sm font-semibold text-blue-600 mt-2">Note: Sponsored listings are $199 for year 1, then $249.99 for year 2+ (subject to change)</p>
        </div>
      </div>
    </div>
  );
}
