
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, User as UserIcon, Calendar, Share2, ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import SeoMeta from "../components/shared/SeoMeta";
import RotatingBanner from "../components/shared/RotatingBanner"; // Changed import path
import GoogleAd from "../components/shared/GoogleAd"; // Changed import path
import SocialShareButtons from "../components/shared/SocialShareButtons";

// IMPROVED: Better content normalization
function normalizeContent(content) {
  if (!content) return '';
  
  // Check if content already has markdown formatting
  const hasMarkdown = /^##\s+/m.test(content);
  
  if (hasMarkdown) {
    // Already formatted, just ensure proper spacing
    return content.replace(/\n(?!\n)/g, '\n\n');
  }
  
  // Plain text content - needs full conversion
  let formatted = content;
  
  // Split into paragraphs
  const paragraphs = formatted.split(/\n\n+/);
  const converted = [];
  
  for (let para of paragraphs) {
    para = para.trim();
    if (!para) continue;
    
    // Check if it's a heading (short line, title case, no punctuation at end)
    if (para.length < 80 && /^[A-Z][^.!?]*$/.test(para) && !para.includes(':')) {
      // Make it a heading
      if (para.match(/^(What|How|Why|When|Where|Who|Benefits|Challenges|Types|Features|Key|Leading|Future|Frequently|Conclusion)/)) {
        converted.push(`\n## ${para}\n`);
      } else {
        converted.push(`\n### ${para}\n`);
      }
      continue;
    }
    
    // Check for numbered lists
    if (/^\d+\.\s+/.test(para)) {
      const lines = para.split(/\n/);
      converted.push('\n' + lines.map(line => {
        if (/^\d+\.\s+/.test(line)) {
          return line.replace(/^(\d+\.\s+)([A-Z][^:\n]+)(:?)/, '$1**$2**$3');
        }
        return line;
      }).join('\n') + '\n');
      continue;
    }
    
    // Check for bullet points
    if (/^[-•]\s+/.test(para)) {
      converted.push('\n' + para + '\n');
      continue;
    }
    
    // Bold any "Label:" patterns
    para = para.replace(/([A-Z][a-zA-Z\s]+):/g, '**$1:**');
    
    // Regular paragraph
    converted.push(para + '\n');
  }
  
  return converted.join('\n');
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

    try {
      const posts = await base44.entities.BlogPost.filter({ slug: slug, published: true });
      if (posts.length > 0) {
        setPost(posts[0]);
      }
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
      const href = '#' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      toc.push({ href, label: title });
    }
    
    return toc;
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
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
          <p className="text-slate-600 mb-8">The blog post you're looking for doesn't exist.</p>
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
  const formattedDate = new Date(post.created_date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta 
        title={post.title}
        description={post.excerpt || post.content.substring(0, 160)}
        keywords={post.tags?.join(', ')}
        image={post.featured_image}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to={createPageUrl("Blog")} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Leaderboard Ad */}
        <div className="mb-8 flex justify-center">
          <RotatingBanner bannerType="leaderboard" />
        </div>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {post.featured_image && (
            <div className="w-full h-64 md:h-96">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 space-y-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="secondary">{post.category}</Badge>
                {post.ai_generated && (
                  <Badge className="bg-purple-100 text-purple-700">AI Generated</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {post.author_name || 'CryptoAI Central'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.reading_time || Math.ceil(post.content.split(' ').length / 200)} min read
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {toc.length > 0 && (
              <Card className="border-l-4 border-blue-500 bg-blue-50/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-700" />
                  <h2 className="text-blue-700 text-sm font-bold uppercase tracking-widest">
                    Table of Contents
                  </h2>
                </div>
                <ul className="space-y-2">
                  {toc.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <div className="article-content prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-slate-200
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-5 prose-h3:text-slate-800
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-ul:my-6 prose-ul:space-y-3 prose-ul:text-lg
              prose-ol:my-6 prose-ol:space-y-3 prose-ol:text-lg
              prose-li:text-slate-700 prose-li:leading-relaxed prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-5 prose-blockquote:my-6 prose-blockquote:italic
              prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-slate-800
              prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6
              prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
              prose-hr:my-10 prose-hr:border-slate-300
              prose-table:my-8 prose-table:border-collapse
              prose-th:bg-slate-100 prose-th:border prose-th:border-slate-300 prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:border prose-td:border-slate-300 prose-td:p-3
            ">
              <style>{`
                .article-content h2 {
                  scroll-margin-top: 2rem;
                  font-size: 2rem;
                  line-height: 1.3;
                  margin-top: 3rem;
                  margin-bottom: 1.5rem;
                  padding-bottom: 0.75rem;
                  border-bottom: 2px solid #e2e8f0;
                }
                
                .article-content h3 {
                  scroll-margin-top: 2rem;
                  font-size: 1.5rem;
                  line-height: 1.4;
                  margin-top: 2.5rem;
                  margin-bottom: 1.25rem;
                  color: #1e293b;
                }
                
                .article-content p {
                  margin-bottom: 1.5rem;
                  line-height: 1.8;
                }
                
                .article-content ul, 
                .article-content ol {
                  margin-top: 1.5rem;
                  margin-bottom: 1.5rem;
                  padding-left: 1.5rem;
                }
                
                .article-content li {
                  margin-bottom: 0.75rem;
                  line-height: 1.7;
                }
                
                .article-content hr {
                  margin: 2.5rem 0;
                  border-color: #cbd5e1;
                }
                
                .article-content table {
                  width: 100%;
                  margin: 2rem 0;
                }
                
                .article-content blockquote {
                  margin: 1.5rem 0;
                }
              `}</style>
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => {
                    const text = props.children?.toString() || '';
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return <h2 id={id} {...props} />;
                  },
                  h3: ({node, ...props}) => {
                    const text = props.children?.toString() || '';
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    return <h3 id={id} {...props} />;
                  },
                }}
              >
                {normalizedContent}
              </ReactMarkdown>
            </div>

            {/* Social Share Buttons */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Share this article</h3>
              <SocialShareButtons
                title={post.title}
                description={post.excerpt || post.content.substring(0, 160)}
                contentType="blog_post"
                contentId={post.id}
                variant="default"
              />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Floating Share Buttons */}
        <SocialShareButtons
          url={window.location.href}
          title={post.title}
          description={post.excerpt}
          variant="floating"
        />

        {/* Rectangle Ad After Article */}
        <div className="mt-8 flex justify-center">
          <RotatingBanner bannerType="rectangle" />
        </div>
        
        {/* Google AdSense */}
        <div className="mt-6 flex justify-center">
          <GoogleAd 
            adSlot="4567890123" 
            style={{ display: 'block', width: '728px', height: '90px', maxWidth: '100%' }}
            adFormat="horizontal"
          />
        </div>

        <div className="mt-8 text-center">
          <Link to={createPageUrl("Blog")}>
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Read More Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
