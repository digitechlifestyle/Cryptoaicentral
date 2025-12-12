import React from "react";
import { Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import NewsletterSignup from "./NewsletterSignup";
import RotatingBanner from "./RotatingBanner";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Newsletter Section */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>

        {/* Leaderboard Ad in Footer */}
        <div className="mb-12 flex justify-center">
          <RotatingBanner bannerType="leaderboard" />
        </div>

        {/* Updated grid layout with mb-8 margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Crypto AI Central</h3>
            <p className="text-slate-300 mb-4">
              Your trusted directory for AI trading bots, DeFi protocols, and blockchain infrastructure.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/CryptoAICentral" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="mailto:hello@cryptoaicentral.com" className="text-slate-300 hover:text-white transition-colors">
                <span className="sr-only">Email</span>
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to={createPageUrl("Home")} className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to={createPageUrl("Browse")} className="hover:text-white transition-colors">Browse All</Link></li>
              <li><Link to={createPageUrl("Featured")} className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link to={createPageUrl("Blog")} className="hover:text-white transition-colors">Blog & News</Link></li>
              <li><Link to={createPageUrl("AddListing")} className="hover:text-white transition-colors">Submit Project</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to={createPageUrl("Category") + "?cat=AI Trading Bots"} className="hover:text-white transition-colors">AI Trading Bots</Link></li>
              <li><Link to={createPageUrl("Category") + "?cat=DeFi Protocols"} className="hover:text-white transition-colors">DeFi Protocols</Link></li>
              <li><Link to={createPageUrl("Category") + "?cat=Crypto Wallets"} className="hover:text-white transition-colors">Crypto Wallets</Link></li>
              <li><Link to={createPageUrl("Category") + "?cat=Exchanges"} className="hover:text-white transition-colors">Exchanges</Link></li>
              <li><Link to={createPageUrl("Category") + "?cat=On-Chain Analytics"} className="hover:text-white transition-colors">Analytics</Link></li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to={createPageUrl("About")} className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to={createPageUrl("EditorialStandards")} className="hover:text-white transition-colors">Editorial Standards</Link></li>
              <li><Link to={createPageUrl("Contact")} className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to={createPageUrl("BrandAssets")} className="hover:text-white transition-colors">Brand Assets</Link></li>
              <li><Link to={createPageUrl("Advertise")} className="hover:text-white transition-colors font-semibold">🎯 Advertise With Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-300 text-sm">
            © {currentYear} Crypto AI Central. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-300">
            <Link to={createPageUrl("About")} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to={createPageUrl("About")} className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:hello@cryptoaicentral.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}