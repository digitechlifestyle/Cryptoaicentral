import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Clock, User as UserIcon } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SeoMeta from "../components/shared/SeoMeta";
import GoogleAd from "../components/shared/GoogleAd";
import RotatingBanner from "../components/shared/RotatingBanner";
import { getSeoArticleBySlug } from "@/data/allSeoArticles";

function cleanMarkdown(content = "") {
  return content.replace(/\n(?!\n)/g, "\n\n");
}

export default function GuidePostPage() {
  const location = useLocation();
  const slug = new URLSearchParams(location.search).get("slug");
  const post = useMemo(() => getSeoArticleBySlug(slug), [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Guide Not Found</h1>
          <p className="text-slate-600 mb-8">This guide is not available yet.</p>
          <Link to={createPageUrl("Blog")}><Button>Back to Blog</Button></Link>
        </div>
      </div>
    );
  }

  const content = cleanMarkdown(post.content || "");
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = post.reading_time || Math.max(3, Math.ceil(wordCount / 200));
  const formattedDate = new Date(post.created_date || Date.now()).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta
        title={`${post.title} | Crypto AI Central`}
        description={post.excerpt || content.slice(0, 155)}
        keywords={post.tags?.join(", ")}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link to={createPageUrl("Blog")} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>

        <div className="mb-8 flex justify-center">
          <RotatingBanner bannerType="leaderboard" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-10 space-y-8">
              <header>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge variant="secondary">{post.category}</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Evergreen Guide</Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">{post.title}</h1>
                <p className="text-xl text-slate-600 mb-6">{post.excerpt}</p>
                <div className="flex items-center gap-4 flex-wrap text-sm text-slate-600 border-y border-slate-200 py-4">
                  <span className="flex items-center gap-1"><UserIcon className="w-4 h-4" /> {post.author_name || "Crypto AI Central Editorial Team"}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formattedDate}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {readingTime} min read</span>
                </div>
              </header>

              <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-h3:text-xl prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <GoogleAd adSlot="1234567890" style={{ display: "block", width: "300px", height: "250px", maxWidth: "100%" }} adFormat="rectangle" />
            <Card className="bg-slate-950 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Build your crypto knowledge</h3>
                <p className="text-slate-300 text-sm mb-4">Continue with practical guides on crypto, AI tools, blockchain, wallets and Web3 monetisation.</p>
                <Link to={createPageUrl("Blog")}><Button className="w-full">See All Guides</Button></Link>
              </CardContent>
            </Card>
            <RotatingBanner bannerType="vertical" />
          </aside>
        </div>
      </div>
    </div>
  );
}
