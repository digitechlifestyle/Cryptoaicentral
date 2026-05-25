import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Search, Star, ArrowRightLeft, BookOpen, FileText, DollarSign, Info, Mail } from "lucide-react";
import Logo from "@/components/shared/Logo";

const navItems = [
  { name: "Home", href: createPageUrl("Home"), icon: Home },
  { name: "Browse", href: createPageUrl("Browse"), icon: Search },
  { name: "Featured", href: createPageUrl("Featured"), icon: Star },
  { name: "Compare", href: createPageUrl("Compare"), icon: ArrowRightLeft },
  { name: "Learn", href: createPageUrl("Learn"), icon: BookOpen },
  { name: "Blog", href: createPageUrl("Blog"), icon: FileText },
  { name: "Advertise", href: createPageUrl("Advertise"), icon: DollarSign },
  { name: "About", href: createPageUrl("About"), icon: Info },
  { name: "Contact", href: createPageUrl("Contact"), icon: Mail }
];

export default function PublicLayout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to={createPageUrl("Home")} className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <div>
              <div className="text-lg font-black tracking-tight">Crypto AI Central</div>
              <div className="text-xs uppercase tracking-[0.25em] text-blue-300">Guides • Tools • Web3</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`rounded-full px-3 py-2 text-sm transition ${currentPageName === item.name ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:hidden">
          {navItems.map((item) => (
            <Link key={item.name} to={item.href} className="whitespace-nowrap rounded-full bg-white/10 px-3 py-2 text-xs text-slate-200">
              {item.name}
            </Link>
          ))}
        </div>
      </header>

      <main className="min-h-[70vh] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-slate-950 px-4 py-10 text-center text-sm text-slate-400">
        <p>© 2026 Crypto AI Central. Education-first crypto, AI and Web3 guides.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link to={createPageUrl("Blog")} className="hover:text-white">Blog</Link>
          <Link to={createPageUrl("Learn")} className="hover:text-white">Learn</Link>
          <Link to={createPageUrl("Contact")} className="hover:text-white">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
