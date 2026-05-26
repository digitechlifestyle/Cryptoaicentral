import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Calendar, CheckCircle2, Clock, ShieldCheck, User as UserIcon, Wallet } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SeoMeta from "../components/shared/SeoMeta";
import GoogleAd from "../components/shared/GoogleAd";
import { allSeoArticles, getSeoArticleBySlug } from "@/data/allSeoArticles";

function cleanMarkdown(content = "") {
  return content.replace(/\n(?!\n)/g, "\n\n");
}

function guideUrl(slug) {
  return createPageUrl("GuidePost") + `?slug=${slug}`;
}

function fallbackImage(topic = "Crypto AI") {
  return `https://placehold.co/1200x675/0f172a/ffffff?text=${encodeURIComponent(topic + ' Guide')}`;
}

function GuideVisual({ post }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl md:p-8">
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-amber-400/25 blur-3xl" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-blue-200">Visual explainer</p>
          <h2 className="mt-3 text-2xl font-black md:text-3xl">{post.topic || post.category} at a glance</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">A quick map of the main idea, risks and practical next step for this guide.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-4"><BookOpen className="mb-3 h-7 w-7 text-blue-200" /><p className="text-sm font-bold">Learn</p></div>
          <div className="rounded-2xl bg-white/10 p-4"><ShieldCheck className="mb-3 h-7 w-7 text-emerald-200" /><p className="text-sm font-bold">Risk</p></div>
          <div className="rounded-2xl bg-white/10 p-4"><Wallet className="mb-3 h-7 w-7 text-amber-200" /><p className="text-sm font-bold">Tools</p></div>
          <div className="rounded-2xl bg-white/15 p-4"><BarChart3 className="mb-3 h-7 w-7 text-purple-200" /><p className="text-sm font-bold">Compare</p></div>
        </div>
      </div>
    </div>
  );
}

export default function GuidePostPage() {
  const location = useLocation();
  const slug = new URLSearchParams(location.search).get("slug");
  const post = useMemo(() => getSeoArticleBySlug(slug), [slug]);

  const relatedGuides = useMemo(() => {
    if (!post) return [];
    return allSeoArticles.filter((article) => article.slug !== post.slug).slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold">Guide Not Found</h1>
          <p className="mb-8 text-slate-300">This guide is not available yet.</p>
          <Link to={createPageUrl("Blog")}><Button>Back to Blog</Button></Link>
        </div>
      </div>
    );
  }

  const content = cleanMarkdown(post.content || "");
  const wordCount = post.word_count || content.split(/\s+/).filter(Boolean).length;
  const readingTime = post.reading_time || Math.max(3, Math.ceil(wordCount / 200));
  const imageSrc = post.image_url || fallbackImage(post.topic || post.category || "Crypto AI");
  const formattedDate = new Date(post.created_date || Date.now()).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SeoMeta
        title={`${post.title} | Crypto AI Central`}
        description={post.excerpt || content.slice(0, 155)}
        keywords={post.tags?.join(", ")}
      />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.32),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.22),_transparent_28%)] px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <Link to={createPageUrl("Blog")} className="mb-8 inline-flex items-center text-blue-200 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Link>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <header>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white">{post.category}</Badge>
                <Badge className="bg-emerald-500 text-slate-950">Evergreen Guide</Badge>
                <Badge variant="outline" className="border-white/20 text-white">{wordCount.toLocaleString()} words</Badge>
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">{post.excerpt}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1"><UserIcon className="h-4 w-4" /> {post.author_name || "Crypto AI Central Editorial Team"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {formattedDate}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {readingTime} min read</span>
              </div>
            </header>
            <GuideVisual post={post} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-950 shadow-2xl">
          <figure className="border-b border-slate-200 bg-slate-100">
            <img src={imageSrc} alt={post.image_alt || `${post.title} visual guide`} className="h-auto w-full object-cover" loading="eager" />
            <figcaption className="px-6 py-3 text-sm text-slate-600 md:px-8">{post.image_caption || `A visual guide for ${post.title}.`}</figcaption>
          </figure>

          <div className="border-b border-slate-200 bg-slate-50 p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm"><CheckCircle2 className="mb-3 h-6 w-6 text-emerald-600" /><h3 className="font-black">Beginner-friendly</h3><p className="mt-2 text-sm text-slate-600">Plain-English education before products.</p></div>
              <div className="rounded-2xl bg-white p-5 shadow-sm"><ShieldCheck className="mb-3 h-6 w-6 text-blue-600" /><h3 className="font-black">Risk-aware</h3><p className="mt-2 text-sm text-slate-600">Scams, volatility and custody explained.</p></div>
              <div className="rounded-2xl bg-white p-5 shadow-sm"><BarChart3 className="mb-3 h-6 w-6 text-amber-600" /><h3 className="font-black">Actionable</h3><p className="mt-2 text-sm text-slate-600">Clear next steps and comparison angles.</p></div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="prose prose-lg prose-slate max-w-none prose-img:rounded-2xl prose-img:shadow-lg prose-headings:font-black prose-h2:mt-12 prose-h2:border-t prose-h2:border-slate-200 prose-h2:pt-8 prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-8 prose-li:leading-8 prose-strong:text-slate-950">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>

            <div className="mt-12 rounded-3xl bg-slate-950 p-6 text-white md:p-8">
              <h2 className="text-2xl font-black">Next step: compare tools safely</h2>
              <p className="mt-3 text-slate-300">Use this guide as a foundation before comparing wallets, exchanges, AI tools or portfolio trackers. Crypto AI Central should prioritise trust and usefulness before affiliate links.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={createPageUrl("Learn")}><Button className="bg-blue-600 hover:bg-blue-700">Learning Hub</Button></Link>
                <Link to={createPageUrl("Blog")}><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">More Guides</Button></Link>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <Card className="border-white/10 bg-white text-slate-950 shadow-xl">
            <CardContent className="p-6">
              <h3 className="mb-3 text-xl font-black">Build your crypto knowledge</h3>
              <p className="mb-4 text-sm leading-6 text-slate-600">Continue with practical guides on crypto, AI tools, blockchain, wallets and Web3 monetisation.</p>
              <Link to={createPageUrl("Blog")}><Button className="w-full">See All Guides <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50 text-slate-950"><CardContent className="p-6"><h3 className="mb-3 text-lg font-black">Affiliate space</h3><p className="text-sm leading-6 text-slate-700">Future comparison links should be added here only after review, disclosure and risk checks.</p></CardContent></Card>
          <GoogleAd adSlot="1234567890" style={{ display: "block", width: "300px", height: "250px", maxWidth: "100%" }} adFormat="rectangle" />
        </aside>
      </div>

      <section className="border-t border-white/10 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-black text-white">Related guides</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {relatedGuides.map((article) => (
              <Link key={article.slug} to={guideUrl(article.slug)}>
                <Card className="h-full border-white/10 bg-white/10 text-white transition hover:bg-white/[0.14]">
                  <CardContent className="p-6">
                    <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">{article.category}</Badge>
                    <h3 className="text-xl font-black">{article.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{article.excerpt}</p>
                    <div className="mt-5 flex items-center text-sm font-bold text-blue-300">Read next <ArrowRight className="ml-2 h-4 w-4" /></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
