
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createPageUrl } from "@/utils";
import {
  Home,
  Search,
  Star,
  Plus,
  User as UserIcon,
  Settings,
  LogOut,
  DollarSign,
  FileText,
  Info,
  Mail,
  Briefcase,
  Bot,
  BarChart3,
  Eye,
  Shield,
  Zap,
  Coins,
  Wallet,
  ArrowRightLeft,
  Layers,
  Network,
  Building2,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ShieldAlert, // Added for Site Health Check
  Gift, // Added for Rewards navigation item
  BookOpen // Added for Learn navigation item
} from "lucide-react";

import Logo from "@/components/shared/Logo";
import SiteFooter from "@/components/shared/SiteFooter";

const topCategories = [
  { name: "AI Content Tools", icon: Bot, color: "text-purple-600" },
  { name: "AI Trading Bots", icon: Bot, color: "text-cyan-600" },
  { name: "Cross-Chain Bridges", icon: Building2, color: "text-pink-600" },
  { name: "Crypto Cards", icon: CreditCard, color: "text-emerald-600" },
  { name: "Crypto Wallets", icon: Wallet, color: "text-blue-600" },
  { name: "DeFi Protocols", icon: Coins, color: "text-orange-600" },
  { name: "Exchanges", icon: ArrowRightLeft, color: "text-green-600" },
  { name: "Layer 2 Scaling Solutions", icon: Network, color: "text-indigo-600" },
  { name: "On-Chain Analytics", icon: BarChart3, color: "text-purple-600" },
  { name: "Oracles", icon: Zap, color: "text-yellow-600" },
  { name: "Portfolio Trackers", icon: Eye, color: "text-green-600" },
  { name: "Smart Contract Auditors", icon: Shield, color: "text-red-600" },
  { name: "Smart Contract Platforms", icon: CreditCard, color: "text-gray-600" },
  { name: "Staking Platforms", icon: Layers, color: "text-teal-600" }
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const location = useLocation();

  const checkUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setIsAdmin(userData?.role === 'admin');
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkUser();

    // FIXED: Set accessible viewport that allows user zooming
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    // IMPORTANT: Allow users to zoom for accessibility
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';

    // Add Google AdSense meta tag for verification
    if (!document.querySelector('meta[name="google-adsense-account"]')) {
      const adsenseMeta = document.createElement('meta');
      adsenseMeta.name = 'google-adsense-account';
      adsenseMeta.content = 'ca-pub-7177380383874452';
      document.head.appendChild(adsenseMeta);
    }

    // Add additional AdSense verification meta
    if (!document.querySelector('meta[name="google-site-verification"]')) {
      const verifyMeta = document.createElement('meta');
      verifyMeta.name = 'google-site-verification';
      verifyMeta.content = 'pub-7177380383874452';
      document.head.appendChild(verifyMeta);
    }

    // Load Google AdSense script - hardcoded publisher ID for reliability
    const loadAdSense = () => {
      if (window.adsbygoogle || document.querySelector('script[data-ad-client="ca-pub-7177380383874452"]')) return;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7177380383874452';
      script.crossOrigin = 'anonymous';
      script.setAttribute('data-ad-client', 'ca-pub-7177380383874452');
      document.head.appendChild(script);
    };

    loadAdSense();

    // Add ads.txt content as a comment for reference
    // For ads.txt file, you need to host: google.com, pub-7177380383874452, DIRECT, f08c47fec0942fa0
    // Contact Base44 support to add ads.txt file to your domain root
  }, [location.pathname]);

  const handleLogin = (isRegister = false) => {
    // FIX: Use base44's built-in redirect method for login or register
    if (isRegister) {
      base44.auth.redirectToRegister();
    } else {
      base44.auth.redirectToLogin();
    }
  };

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      setUser(null);
      setIsAdmin(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
    { name: "Home", href: createPageUrl("Home"), icon: Home },
    { name: "Browse", href: createPageUrl("Browse"), icon: Search },
    { name: "Featured", href: createPageUrl("Featured"), icon: Star },
    { name: "Compare", href: createPageUrl("Compare"), icon: ArrowRightLeft },
    { name: "Learn", href: createPageUrl("Learn"), icon: BookOpen },
    { name: "Rewards", href: createPageUrl("Rewards"), icon: Gift },
    { name: "Add Listing", href: createPageUrl("AddListing"), icon: Plus },
    { name: "Blog", href: createPageUrl("Blog"), icon: FileText },
    { name: "Advertise", href: createPageUrl("Advertise"), icon: DollarSign },
    { name: "About", href: createPageUrl("About"), icon: Info },
    { name: "Contact", href: createPageUrl("Contact"), icon: Mail },
    { name: "Affiliate Program", href: createPageUrl("AffiliateProgram"), icon: Briefcase },
  ];

  const adminNavigationItems = isAdmin ? [
    { name: "Admin Panel", href: createPageUrl("Admin"), icon: Settings },
    { name: "Ad Management", href: createPageUrl("AdManagement"), icon: DollarSign },
    { name: "Newsletter Campaigns", href: createPageUrl("NewsletterCampaigns"), icon: Mail },
    { name: "Site Health Check", href: createPageUrl("SiteHealthCheck"), icon: ShieldAlert },
  ] : [];

  const categoriesToShow = showAllCategories ? topCategories : topCategories.slice(0, 8);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-yellow-50/20 overflow-x-hidden">
        <style>{`
          :root {
            --primary-navy: #0F172A;
            --primary-blue: #3B82F6;
            --accent-indigo: #6366F1;
            --accent-gold: #F59E0B;
            --accent-yellow: #EAB308;
            --text-primary: #1E293B;
            --text-secondary: #64748B;
            --surface-white: #FFFFFF;
            --surface-gray: #F8FAFC;
            --border-light: #E2E8F0;
            --shadow-subtle: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-gold: 0 4px 14px 0 rgba(245, 158, 11, 0.2);
            --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --gradient-primary: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #F59E0B 100%);
            --gradient-text: linear-gradient(135deg, #1E40AF 0%, #4F46E5 50%, #D97706 100%);
          }

          /* Aggressive mobile layout fixes */
          * {
            box-sizing: border-box;
          }

          html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
            margin: 0; /* Added for HTML validation/mobile consistency */
            padding: 0; /* Added for HTML validation/mobile consistency */
          }

          /* Ensure #root and immediate children don't cause horizontal scroll */
          #root, #root > div {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
          }
          /* End aggressive mobile layout fixes */


          /* Google AdSense responsive styles */
          .adsbygoogle {
            display: block;
          }

          .ad-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 1rem 0;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-feature-settings: 'cv01', 'cv02', 'cv03', 'cv04', 'calt';
          }

          .glass-effect {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .card-hover {
            transition: var(--transition-smooth);
          }

          .card-hover:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-gold);
          }

          .gradient-text {
            background: var(--gradient-text);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .gradient-bg {
            background: var(--gradient-primary);
          }

          .category-section {
            border-top: 1px solid #e2e8f0;
            margin-top: 0.5rem;
            padding-top: 0.5rem;
          }

          /* Ensure proper touch targets for mobile (44x44px minimum) */
          @media (max-width: 768px) {
            button, a, input[type="submit"], input[type="button"] {
              min-height: 44px;
              min-width: 44px;
              /* Optional: Add padding to make up the space if elements are smaller than 44px and don't affect layout too much */
              /* padding: 8px; */
            }
            /* Specific overrides for elements that are naturally smaller or have specific roles */
            .sidebar-trigger, .dropdown-menu-trigger { /* Adjust these class names based on actual component usage */
                min-height: 36px;
                min-width: 36px;
                padding: 4px; /* Adjust padding if needed for smaller icons */
            }
          }
        `}</style>

        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200/60 shadow-sm bg-white/90 backdrop-blur-sm hidden md:flex">
          <SidebarHeader className="border-b border-slate-200/60 p-4">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <Logo className="w-10 h-10 transition-transform duration-200 group-hover:scale-105" />
              <div>
                <h1 className="text-xl font-bold gradient-text">CRYPTOAI</h1>
                <p className="text-xs text-slate-500 font-medium">CENTRAL</p>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="py-4">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                        currentPageName === item.name
                          ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                          : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            {/* Admin Section */}
            {isAdmin && adminNavigationItems.length > 0 && (
              <div className="category-section px-3">
                <h3 className="text-sm font-semibold text-slate-600 mb-3 px-3">Admin</h3>
                <SidebarMenu>
                  {adminNavigationItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                            currentPageName === item.name
                              ? 'bg-red-50 text-red-700 font-medium border-r-2 border-red-600'
                              : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            )}

            {/* Categories Section */}
            <div className="category-section px-3">
              <h3 className="text-sm font-semibold text-slate-600 mb-3 px-3">Categories</h3>
              <SidebarMenu>
                {categoriesToShow.map((category) => (
                  <SidebarMenuItem key={category.name}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={createPageUrl("Category") + `?cat=${encodeURIComponent(category.name)}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                      >
                        <category.icon className={`w-4 h-4 flex-shrink-0 ${category.color}`} />
                        <span className="flex-1 text-sm">{category.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 w-full"
                    >
                      {showAllCategories ? (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="flex-1 text-sm text-left">
                        {showAllCategories ? 'Show Less' : 'Show More Categories'}
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-auto">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user.full_name || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Dashboard")}>
                      <UserIcon className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Settings")}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Admin")}>
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("AdManagement")}>
                          <DollarSign className="w-4 h-4 mr-2" />
                          Ad Management
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("NewsletterCampaigns")}>
                          <Mail className="w-4 h-4 mr-2" />
                          Newsletter Campaigns
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("SiteHealthCheck")}>
                          <ShieldAlert className="w-4 h-4 mr-2" />
                          Site Health Check
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-y-2">
                <Button onClick={() => handleLogin(false)} className="w-full gradient-bg text-white">
                  Login
                </Button>
                <Button onClick={() => handleLogin(true)} variant="outline" className="w-full">
                  Register
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col w-full min-w-0">
          {/* Mobile header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-3 py-2.5 md:hidden flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <SidebarTrigger className="hover:bg-slate-100 p-1.5 rounded-lg transition-colors duration-200 flex-shrink-0 sidebar-trigger" />
              <Link to={createPageUrl("Home")} className="flex items-center gap-1.5 min-w-0">
                <Logo className="w-6 h-6 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-xs font-bold gradient-text whitespace-nowrap truncate">CRYPTO AI</h1>
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider">CENTRAL</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {user ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 dropdown-menu-trigger">
                                <UserIcon className="w-4 h-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs">{user.full_name || user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem asChild>
                                <Link to={createPageUrl("Dashboard")}>
                                    <UserIcon className="w-3 h-3 mr-2"/>Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={createPageUrl("Settings")}>
                                    <Settings className="w-3 h-3 mr-2"/>Settings
                                </Link>
                            </DropdownMenuItem>
                            {isAdmin && (
                                <>
                                  <DropdownMenuSeparator/>
                                  <DropdownMenuItem asChild>
                                      <Link to={createPageUrl("Admin")}>
                                          <Settings className="w-3 h-3 mr-2"/>Admin Panel
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                      <Link to={createPageUrl("AdManagement")}>
                                          <DollarSign className="w-3 h-3 mr-2"/>Ad Management
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                      <Link to={createPageUrl("NewsletterCampaigns")}>
                                          <Mail className="w-3 h-3 mr-2"/>Newsletter Campaigns
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                      <Link to={createPageUrl("SiteHealthCheck")}>
                                          <ShieldAlert className="w-3 h-3 mr-2"/>Site Health Check
                                      </Link>
                                  </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="w-3 h-3 mr-2"/>Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                ) : (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleLogin(false)} className="text-xs px-2 h-8">
                          Login
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleLogin(true)} className="text-xs px-2 h-8">
                          Register
                      </Button>
                    </div>
                )}
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* Site Footer */}
          <SiteFooter />
        </main>
      </div>
    </SidebarProvider>
  );
}
