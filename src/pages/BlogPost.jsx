import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, User as UserIcon, Calendar, Share2, ArrowLeft, BookOpen } from "lucide-react";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import SeoMeta from "../components/shared/SeoMeta";
import RotatingBanner from "../components/shared/RotatingBanner";
import GoogleAd from "../components/shared/GoogleAd";
import SocialShareButtons from "../components/shared/SocialShareButtons";
import { getArticleBySlug } from "@/data/seoArticles";

function normalizeContent(content) {
  if (!content) return '';
  const hasMarkdown = /^##\s+/m.test(content) || /^#\s+/m.test(content);
  if (hasMarkdown) return content.replace(/\n(?!\n)/g, '\n\n');
  return content.split(/\n\n+/).map(paragraph => paragraph.trim()).filter(Boolean).join('\n\n');
}

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPost();
    checkUser();
  }, [location.search]);

  const checkUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const loadPost = async () => {
    setIsLoading(true);
    const params = new URLSearchParams(location.search);
    const slug = params.get("slug");

    if (!slug) {
      setIsLoading(false);
      return;
    }

    const evergreenPost = getArticleBySlug(slug);
    if (evergreenPost) {
      setPost(evergreenPost);
      setIsLoading(false);
      return;
    }

    try {
      const posts = await base44.entities.BlogPost.filter({ slug: slug, published: true });
      if (posts.length > 0) setPost(posts[0]);
    } catch (error) {
      console.error("Error loading post:", error);
    }
    setIsLoading(false);
  };

  const extractTableOfContents = (content) => {
    if (!content) return [];
    const headingRegex = /^##\s+(.+)$/gm;
    const toc = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const title = match[1].replace(/[🧩🔄💡🎯✅🔍⚡🌐📊🔐⚙️🚀💰📈🛡️🔗🎨📱💻🏗️*]/g, '').trim();
      const href = '#' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      toc.push({ href, label: title });
    }
    return toc;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share && post) {
      try {
        await navigator.share({ title: post.title, url });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Post Not Found</h1>
          <p className="text-slate-600 mb-8">The blog post you're looking for doesn't exist yet.</p>
          <Link to={createPageUrl("Blog")}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const normalizedContent = normalizeContent(post.content);
  const toc = extractTableOfContents(normalizedContent);
  const wordCount = normalizedContent.split(/\s+/).filter(Boolean).length;
  const formattedDate = new Date(post.created_date || Date.now()).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta
        title={`${post.title} | Crypto AI Central`}
        description={post.excerpt || normalizedContent.substring(0, 155)}
        keywords={post.tags?.join(', ')}
        image={post.featured_image}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link to={createPageUrl("Blog")} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <div className="mb-8 flex justify-center">
          <RotatingBanner bannerType="leaderboard" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            {post.featured_image && (
              <div className="w-full h-64 md:h-96">
                <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 md:p-10 space-y-8">
              <header>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge variant="secondary">{post.category}</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Evergreen Guide</Badge>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">{post.title}</h1>

                <p className="text-xl text-slate-600 mb-6">{post.excerpt}</p>

                <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-slate-600 border-y border-slate-200 py-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1"><UserIcon className="w-4 h-4" /> {post.author_name || 'Crypto AI Central Editorial Team'}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formattedDate}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.reading_time || Math.ceil(wordCount / 200)} min read</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              </header>

              {toc.length > 0 && (
                <Card className="border-l-4 border-blue-500 bg-blue-50/50 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-700" />
                    <h2 className="text-blue-700 text-sm font-bold uppercase tracking-widest">Table of Contents</h2>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {toc.map((item, index) => (
                      <li key={index}>
                        <a href={item.href} className="text-sm text-blue-700 hover:underline">{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-h3:text-xl prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                      return <h2 id={id}>{children}</h2>;
                    }
                  }}
                >
                  {normalizedContent}
                </ReactMarkdown>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="font-bold text-slate-900 mb-3">Share this guide</h3>
                <SocialShareButtons title={post.title} url={window.location.href} />
              </div>
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <GoogleAd
              adSlot="1234567890"
              style={{ display: 'block', width: '300px', height: '250px', maxWidth: '100%' }}
              adFormat="rectangle"
            />
            <Card className="p-6 bg-slate-950 text-white">
              <h3 className="text-xl font-bold mb-3">Build your crypto knowledge</h3>
              <p className="text-slate-300 text-sm mb-4">Continue with beginner-friendly guides on Bitcoin, DeFi, wallets, stablecoins, exchanges and AI crypto tools.</p>
              <Link to={createPageUrl("Blog")}><Button className="w-full">See All Guides</Button></Link>
            </Card>
            <RotatingBanner bannerType="vertical" />
          </aside>
        </div>
      </div>
    </div>
  );
}
