
import React, { useState, useEffect, useCallback } from "react";
import { BlogPost } from "@/api/entities";
import { InvokeLLM, GenerateImage } from "@/api/integrations";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, User as UserIcon, Search, Plus, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import SeoMeta from "../components/shared/SeoMeta";
import RotatingBanner from "@/components/shared/RotatingBanner";
import GoogleAd from "@/components/shared/GoogleAd";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState(null);
  const [userAffiliate, setUserAffiliate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [generationError, setGenerationError] = useState("");
  const [imageProvider, setImageProvider] = useState('default'); // New state for image provider

  useEffect(() => {
    loadPosts();
    checkUser();
  }, []);

  const filterPosts = useCallback(() => {
    let filtered = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Check if user has an active affiliate subscription
      if (currentUser) {
        const { Affiliate } = await import("@/api/entities");
        const affiliates = await Affiliate.filter({ user_email: currentUser.email });
        if (affiliates.length > 0 && affiliates[0].status === 'active') {
          setUserAffiliate(affiliates[0]);
        }
      }
    } catch (error) {
      setUser(null);
      setUserAffiliate(null);
    }
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await BlogPost.filter({ published: true }, "-created_date", 50);
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
    setIsLoading(false);
  };

  const categories = ["News", "Analysis", "Tutorial", "Review", "Industry Update", "Technology", "Market Insights", "Tax"];

  const generateAIContent = async () => {
    // Check if user is admin or paid affiliate
    if (!user || (user.role !== 'admin' && !userAffiliate)) {
      setGenerationError("AI content generation is only available for admins and active affiliate subscribers.");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");
    
    try {
      const cryptoAITopics = [
        "AI Trading Bots in Cryptocurrency Markets",
        "DeFi Protocol Security and Smart Contract Auditing",
        "Cross-Chain Bridge Technology and Interoperability",
        "AI-Powered Portfolio Management for Crypto Investors",
        "Blockchain Analytics and On-Chain Intelligence",
        "Decentralized Exchanges (DEX) and Automated Market Makers",
        "Crypto Wallets: Custody Solutions and Security",
        "Staking Platforms and Liquid Staking Protocols",
        "Layer 2 Scaling Solutions for Ethereum",
        "NFT Marketplaces and Digital Asset Management",
        "Crypto Tax Software and Compliance Tools",
        "Oracle Networks and Real-World Data Integration",
        "Decentralized Identity (DID) and Self-Sovereign Identity",
        "Real World Asset (RWA) Tokenization Platforms",
        "Crypto Payment Processors and Merchant Solutions"
      ];

      const randomTopic = cryptoAITopics[Math.floor(Math.random() * cryptoAITopics.length)];

      const llmContentResponse = await InvokeLLM({
        prompt: `TITLE: ${randomTopic} — Complete Guide and Expert Insights

Write a comprehensive, SEO-optimized, and reader-friendly blog article about "${randomTopic}".
The article should be expert, trustworthy, and educational, appealing to both beginners and advanced readers.
Use clear structure, subheadings, bullet points, tables, and callout boxes for engagement.

**OUTPUT AS CLEAN MARKDOWN - NO META COMMENTS OR WRAPPER TEXT**

------------------------------------------
STRUCTURE AND CONTENT FLOW
------------------------------------------

# ${randomTopic}: Complete Guide and Expert Insights

## Introduction
- Start with an engaging paragraph explaining what ${randomTopic} is and why it matters right now
- Include historical or market context if relevant
- End with a **TL;DR** summary in bold

**TL;DR:** [2-3 sentences: what the reader will learn and who it's for]

---

## What Is ${randomTopic}?

[Clear definition and explanation - 2-3 paragraphs]

### Core Characteristics

- **Characteristic 1**: Brief explanation
- **Characteristic 2**: Brief explanation
- **Characteristic 3**: Brief explanation

---

## Types and Categories

### Type 1: [Name]

**Definition:** [Brief explanation]

**Key Features:**
- Feature A
- Feature B
- Feature C

**Advantages:**
- Pro 1
- Pro 2

**Disadvantages:**
- Con 1
- Con 2

**Best For:** [Ideal use case]

### Type 2: [Name]

[Same structure as Type 1]

### Type 3: [Name]

[Same structure as Type 1]

### Comparison Table

| Type | Key Features | Best For | Cost Range |
|------|-------------|----------|------------|
| Type 1 | [Summary] | [Use case] | [Range] |
| Type 2 | [Summary] | [Use case] | [Range] |
| Type 3 | [Summary] | [Use case] | [Range] |

💡 **Pro Tip:** [Actionable advice for choosing between types]

---

## Leading Examples and Case Studies

### 1. [Example/Platform Name]

**Overview:** [Brief description]

**Standout Features:**
- Feature 1
- Feature 2
- Feature 3

**Achievements:** [Metrics, market position, innovations]

### 2. [Example/Platform Name]

[Same structure]

### 3. [Example/Platform Name]

[Same structure]

📘 **Key Takeaway:** [Main insight from these examples]

---

## How It Works: Technical Overview

[Explain the process or system step-by-step]

### The Process

1.  **Step 1: [Name]**
    - What happens
    - Why it matters

2.  **Step 2: [Name]**
    - What happens
    - Why it matters

3.  **Step 3: [Name]**
    - What happens
    - Why it matters

[Include analogies to simplify complex concepts]

### Performance Considerations

- Consideration 1
- Consideration 2
- Consideration 3

---

## Security and Risk Considerations

### Common Risks

1.  **Risk 1: [Name]**
    - Description
    - Impact
    - Mitigation strategy

2.  **Risk 2: [Name]**
    - Description
    - Impact
    - Mitigation strategy

### Best Practices Checklist

- ✅ Practice 1
- ✅ Practice 2
- ✅ Practice 3
- ✅ Practice 4
- ✅ Practice 5

💡 **Pro Tip:** [Security advice specific to this topic]

---

## Tools and Strategies

### Popular Tools

1.  **Tool 1**
    - What it does
    - Key features
    - Who it's for

2.  **Tool 2**
    - What it does
    - Key features
    - Who it's for

### Recommended Strategies

**For Beginners:**
- Strategy 1
- Strategy 2
- Strategy 3

**For Advanced Users:**
- Strategy 1
- Strategy 2
- Strategy 3

💡 **Pro Tip:** [Actionable strategy advice]

---

## Regulatory and Industry Landscape

### Global Regulations

- **Region 1:** [Regulatory approach]
- **Region 2:** [Regulatory approach]
- **Region 3:** [Regulatory approach]

### Compliance Standards

- Standard 1
- Standard 2
- Standard 3

### Major Organizations

- Organization 1 and their role
- Organization 2 and their role

📘 **Key Takeaway:** [Regulatory considerations summary]

---

## Future Trends and Innovations

### What's Coming in 2024-2028

1.  **Trend 1: [Name]**
    - Description
    - Expected impact
    - Timeline

2.  **Trend 2: [Name]**
    - Description
    - Expected impact
    - Timeline

3.  **Trend 3: [Name]**
    - Description
    - Expected impact
    - Timeline

### AI Integration

[How AI is transforming this space]

### Sustainability and Ethics

[Environmental or ethical considerations]

💡 **Pro Tip:** [How to prepare for future changes]

---

## How to Choose: Evaluation Guide

### Decision Checklist

**Must-Have Features:**
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3

**Evaluation Factors:**

1.  **Cost**
    - Budget considerations
    - Value analysis

2.  **Security**
    - What to look for
    - Red flags

3.  **Reliability**
    - Uptime expectations
    - Track record

4.  **Usability**
    - Learning curve
    - Support resources

### Recommendations by User Type

**Beginners:**
- Recommendation 1
- Recommendation 2
- Why these work

**Intermediate Users:**
- Recommendation 1
- Recommendation 2
- Why these work

**Advanced/Enterprise:**
- Recommendation 1
- Recommendation 2
- Why these work

📘 **Key Takeaway:** [Main selection advice]

---

## Frequently Asked Questions

**Q: [Most common question]?**  
A: [Clear 2-3 sentence answer]

**Q: [Technical question]?**  
A: [Clear answer with example]

**Q: [Security/risk question]?**  
A: [Clear answer with reassurance]

**Q: [Cost/value question]?**  
A: [Clear answer with context]

**Q: [Comparison question]?**  
A: [Clear answer with distinctions]

**Q: [Future/trend question]?**  
A: [Clear answer with predictions]

---

## Conclusion

[Summarize key insights in 2-3 sentences]

[Reinforce why this topic matters]

**Next Steps:**
- Action item 1
- Action item 2
- Action item 3

💡 **Final Tip:** [Motivational closing advice]

---

*Explore more guides on [related topic 1], [related topic 2], and [related topic 3] in our comprehensive resource center.*

------------------------------------------
FORMATTING & SEO REQUIREMENTS
------------------------------------------
- Use ## for H2 and ### for H3 subheadings
- Keep paragraphs under 100 words
- Use bullet points, tables, and checklists liberally
- Naturally include keywords: "best ${randomTopic} 2024", "complete guide to ${randomTopic}", "how to choose ${randomTopic}", "future of ${randomTopic}"
- Add 💡 **Pro Tip:** and 📘 **Key Takeaway:** boxes throughout
- Keep sentences under 25 words
- Professional, educational tone
- 1,800-2,500 words total

Generate the complete article now in markdown format only.`,
      });

      // Extract markdown content
      let markdownContent = llmContentResponse;
      if (typeof llmContentResponse === 'object' && llmContentResponse.text_response) {
        markdownContent = llmContentResponse.text_response;
      }

      // Parse title from the first H1
      const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
      const title = titleMatch && titleMatch[1] ? titleMatch[1].trim() : randomTopic + ": Complete Guide and Expert Insights"; // Fallback with expected format

      // Parse excerpt from the TL;DR section
      const tldrMatch = markdownContent.match(/\*\*TL;DR:\*\*\s*(.+?)(?=\n\n|\n---|\n##|$)/s);
      // If TL;DR is found, use it as excerpt, otherwise take a snippet of the content
      const excerpt = tldrMatch && tldrMatch[1] ? tldrMatch[1].trim() : markdownContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#')).slice(0, 3).join(' ').substring(0, 160).trim();

      // The new prompt specifies "NO META COMMENTS OR WRAPPER TEXT", so cleanContent is just the markdown.
      const cleanContent = markdownContent.trim();

      // Extract tags from H2 headings (excluding common structural headings)
      const tagMatches = cleanContent.match(/##\s+(.+?)(?=\n|$)/g) || []; // Matches H2s followed by newline or end of string
      const filteredTags = tagMatches
        .map(h => h.replace(/##\s+/, '').trim())
        .filter(t => !t.toLowerCase().includes('introduction') &&
                      !t.toLowerCase().includes('what is') &&
                      !t.toLowerCase().includes('types and categories') &&
                      !t.toLowerCase().includes('leading examples') &&
                      !t.toLowerCase().includes('how it works') &&
                      !t.toLowerCase().includes('security and risk') &&
                      !t.toLowerCase().includes('tools and strategies') &&
                      !t.toLowerCase().includes('regulatory and industry landscape') &&
                      !t.toLowerCase().includes('future trends') &&
                      !t.toLowerCase().includes('how to choose') &&
                      !t.toLowerCase().includes('frequently asked questions') &&
                      !t.toLowerCase().includes('conclusion'))
        .slice(0, 5); // Take up to 5 relevant tags

      // Content moderation check
      const moderationResponse = await InvokeLLM({
        prompt: `As a content moderator for a professional cryptocurrency and AI platform, review this article for:

        1. Inappropriate content (hate speech, harassment, discrimination)
        2. Scam promotion or fraudulent schemes
        3. Spam or low-quality content
        4. Off-topic content (not related to crypto/AI)
        5. Misleading financial advice
        6. Regulatory violations

        Article Title: "${title}"
        Article Content: "${cleanContent}"

        Return a JSON response with your moderation decision.`,
        response_json_schema: {
          type: "object",
          properties: {
            approved: { type: "boolean" },
            issues: { type: "array", items: { type: "string" } },
            risk_level: { type: "string", enum: ["low", "medium", "high"] },
            recommendation: { type: "string" }
          }
        }
      });

      // Block content that doesn't pass moderation
      if (!moderationResponse.approved || moderationResponse.risk_level === "high") {
        setGenerationError(`Content generation blocked: ${moderationResponse.recommendation}`);
        setIsGenerating(false);
        return;
      }

      // Generate featured image with MAXIMUM UNIQUENESS
      const uniqueTimestamp = Date.now();
      const randomSeed = Math.random().toString(36).substring(7);
      
      const visualStyles = [
        'Flowing data streams with glowing nodes in blue-purple gradient',
        'Abstract geometric network patterns with golden highlights',
        'Particle system visualization in cyan and indigo tones',
        'Circuit board pathways with electric blue energy flows',
        'Crystalline network structures in purple-blue spectrum',
        'Holographic interface design with gradient overlays',
        'Isometric 3D blockchain visualization (no logos)',
        'Liquid metal gradients with flowing patterns',
        'Low-poly faceted surfaces with light effects',
        'Glowing wireframe networks in blue-gold palette'
      ];
      const randomVisualStyle = visualStyles[Math.floor(Math.random() * visualStyles.length)];

      const imagePrompt = `Professional editorial illustration for: "${title}"

UNIQUE IDENTIFIERS:
- Timestamp: ${uniqueTimestamp}
- Seed: ${randomSeed}
- Topic: ${randomTopic}

STYLE: Modern, abstract, professional financial technology publication
COLORS: Electric blue, indigo, purple, with subtle gold accents, gradient
COMPOSITION: 16:9 landscape, high quality, dynamic flow

CRITICAL REQUIREMENTS:
- NO text, letters, or numbers
- NO Bitcoin logos, Ethereum symbols, or ANY cryptocurrency logos
- NO coins, currency symbols ($, ₿, Ξ), or coin imagery
- NO human figures or faces
- NO specific company logos or branding
- PURELY ABSTRACT: geometric patterns, flowing data streams, circuit pathways, network nodes, particle systems

VISUAL STYLE: ${randomVisualStyle}

Create a COMPLETELY ABSTRACT image that represents data, technology, and innovation WITHOUT any literal symbols or logos.`;

      // Pass the selected image provider to the GenerateImage function
      const imageResponse = await GenerateImage({
        prompt: imagePrompt,
        provider: imageProvider // New: Pass the selected provider
      });

      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Determine category based on keywords in title and random topic, or default
      const categoryKeywords = {
        'Analysis': ['analysis', 'review', 'insights', 'strategies'],
        'Tutorial': ['how to', 'guide', 'tutorial', 'step-by-step', 'implementation'],
        'News': ['latest', 'new', 'announcement', 'update', 'breaking'],
        'Technology': ['protocol', 'blockchain', 'smart contract', 'architecture', 'defi', 'web3', 'ai', 'machine learning', 'innovation', 'tech'],
        'Market Insights': ['market', 'trends', 'price', 'economy', 'investment'],
        'Industry Update': ['industry', 'report', 'sector', 'regulatory'],
        'Review': ['review', 'comparison', 'evaluation'],
        'Tax': ['tax', 'regulation', 'compliance']
      };

      let determinedCategory = 'Technology'; // Default category
      const searchableText = (title + " " + randomTopic).toLowerCase();

      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => searchableText.includes(kw))) {
          determinedCategory = cat;
          break;
        }
      }
      // Ensure the determined category is one of the predefined categories, or use Technology
      if (!categories.includes(determinedCategory)) {
        determinedCategory = 'Technology';
      }

      // Calculate reading time based on word count (approx 200 words per minute)
      const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);


      // Save to database - UNPUBLISHED by default for admin review
      await BlogPost.create({
        title: title,
        slug: slug,
        content: cleanContent,
        excerpt: excerpt,
        category: determinedCategory,
        tags: filteredTags.length > 0 ? filteredTags : [randomTopic, 'blockchain', 'crypto', 'Web3', 'AI', 'innovation'].slice(0, 5), // Provide defaults if no tags found
        featured_image: imageResponse.url,
        published: user.role === 'admin', // Admin publishes directly, others require approval
        ai_generated: true,
        reading_time: readingTime,
        author_name: user.role === 'admin' ? "Joe Robertson" : user.full_name || "AI Assistant"
      });

      // Show success message
      if (user.role === 'admin') {
        setGenerationError("Article generated and published successfully!");
      } else {
        setGenerationError("Article generated and submitted for admin review!");
      }

      await loadPosts();
    } catch (error) {
      console.error("Error generating content:", error);
      setGenerationError("Failed to generate article. Please try again or contact support.");
    }
    setIsGenerating(false);
  };

  // Determine if user can generate content
  const canGenerateContent = user && (user.role === 'admin' || userAffiliate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <SeoMeta 
        title="Blog & News - Latest AI & Crypto Insights | CryptoAI Central"
        description="Stay updated with the latest news, analysis, and insights in AI, blockchain, and cryptocurrency. Explore articles on DeFi, trading, market trends, and more."
        keywords="AI, Crypto, Blockchain, DeFi, News, Analysis, Market Insights, Cryptocurrency, Bitcoin, Ethereum, Web3, Trading, Technology"
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Blog & News
              </h1>
              <p className="text-xl text-slate-600">
                Latest insights, trends, and analysis in AI and crypto
              </p>
            </div>
            
            {canGenerateContent ? (
              <div className="space-y-2">
                <Card className="mb-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            AI Content Generator
                        </CardTitle>
                        <p className="text-sm text-slate-600">
                            {user?.role === 'admin' ? 'Generate professional blog posts with AI assistance' : 'Available for active affiliate subscribers'}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Image Provider:</label>
                                <select
                                    value={imageProvider}
                                    onChange={(e) => setImageProvider(e.target.value)}
                                    className="text-sm border rounded-lg px-3 py-2 bg-white"
                                    disabled={isGenerating}
                                >
                                    <option value="default">Default (Core)</option>
                                    <option value="fal">fal.ai - Faster & Better Quality</option>
                                </select>
                            </div>
                        </div>

                        {imageProvider === 'fal' && (
                            <Alert className="border-blue-500 bg-blue-50">
                                <AlertTitle className="font-bold text-blue-800">Enable fal.ai Integration</AlertTitle>
                                <AlertDescription className="text-blue-700 text-sm">
                                    <p>To use fal.ai:</p>
                                    <ol className="list-decimal list-inside mt-1 space-y-1 pl-4">
                                        <li>Go to Dashboard &rarr; Settings</li>
                                        <li>Enable "Backend Functions"</li>
                                        <li>Request "fal.ai integration" via Feedback button</li>
                                    </ol>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            onClick={generateAIContent}
                            disabled={isGenerating || !user || (user.role !== 'admin' && !userAffiliate)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating AI Content...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate New Article
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
                {user.role !== 'admin' && (
                  <p className="text-xs text-slate-500 max-w-48 text-right">
                    Articles require admin approval before publishing
                  </p>
                )}
              </div>
            ) : user ? (
              <div className="text-center max-w-48">
                <p className="text-sm text-slate-600 mb-2">
                  AI article generation available for affiliate subscribers
                </p>
                <Link to={createPageUrl("AffiliateProgram")}>
                  <Button variant="outline" size="sm">
                    Join Affiliate Program
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
          
          {/* Error/Success Messages */}
          {generationError && (
            <div className={`p-4 rounded-lg mb-4 ${
              generationError.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="text-sm">{generationError}</p>
            </div>
          )}
        </div>

        {/* Leaderboard Banner */}
        <div className="mb-8 flex justify-center">
          <RotatingBanner bannerType="leaderboard" />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Area: Posts Grid and Sidebar */}
        <div className="lg:flex lg:gap-8">
          {/* Posts Grid / Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                    <CardContent className="pt-6">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-slate-200 rounded mb-1"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
                <p className="text-slate-600">Try adjusting your search criteria or check back later for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 card-hover flex flex-col">
                    {post.featured_image && (
                      <div className="h-48 overflow-hidden rounded-t-lg flex-shrink-0">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardContent className="pt-6 flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary" className="whitespace-nowrap">{post.category}</Badge>
                        {post.ai_generated && (
                          <Badge className="bg-purple-100 text-purple-700 whitespace-nowrap flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      
                      <Link to={createPageUrl("BlogPost") + `?slug=${post.slug}`} className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {post.reading_time}min read
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap truncate">
                          <UserIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{post.author_name || (post.created_by ? post.created_by.split('@')[0] : 'Unknown Author')}</span>
                        </span>
                        <span className="whitespace-nowrap">{new Date(post.created_date).toLocaleDateString()}</span>
                      </div>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0 space-y-6 mt-8 lg:mt-0"> {/* Added mt-8 for mobile spacing, lg:mt-0 to remove on desktop */}
            {/* Vertical Banner */}
            <div className="hidden lg:block">
              <RotatingBanner bannerType="vertical" />
            </div>
            
            {searchQuery && ( // Shows search results card only if a search query is active
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search Results for "{searchQuery}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Showing {filteredPosts.length} results matching your query.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Rectangle Banner */}
            <div>
              <RotatingBanner bannerType="rectangle" />
            </div>
            
            {/* Google AdSense */}
            <div className="hidden lg:block">
              <GoogleAd 
                adSlot="3456789012" // Placeholder, replace with actual ad slot ID
                style={{ display: 'block', width: '300px', height: '600px' }}
                adFormat="vertical" // adFormat is a custom prop for styling/layout, not a Google AdSense attribute directly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
