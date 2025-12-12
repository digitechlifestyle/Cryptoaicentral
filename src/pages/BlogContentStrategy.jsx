import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM, GenerateImage } from "@/api/integrations";
import { BlogPost } from "@/api/entities";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";
import { User } from "@/api/entities";

const BLOG_TOPICS = [
  // AI & Productivity (25 topics)
  {
    category: "AI & Productivity",
    topics: [
      "AI is reshaping productivity—learn 3 ways small firms can benefit today",
      "The rise of ChatGPT-style bots marks the next frontier of engagement",
      "Why prompt engineering will soon be the hottest digital skill",
      "Discover how AI analytics predicts customer needs faster than ever",
      "5 AI tools every remote team should adopt in 2025",
      "How machine learning optimizes supply chain management",
      "AI-powered email marketing: boost open rates by 40%",
      "The future of customer service: AI chatbots vs human agents",
      "Automating social media content with GPT-4: a complete guide",
      "Why AI writing assistants are replacing traditional copywriters",
      "How to train custom AI models for your business needs",
      "AI project management tools that actually save time",
      "The ethics of AI in workplace surveillance",
      "Building an AI-first company culture from scratch",
      "How AI reduces hiring bias in recruitment processes",
      "AI-driven sales forecasting: accuracy you can trust",
      "The role of AI in financial planning and analysis",
      "How small businesses compete using AI automation",
      "AI video editing tools revolutionizing content creation",
      "Natural language processing: transforming customer feedback",
      "AI-powered personal assistants for entrepreneurs",
      "Machine learning for fraud detection in e-commerce",
      "How AI improves accessibility for disabled users",
      "The future of AI in education and online learning",
      "AI code generation: will developers become obsolete?"
    ]
  },
  
  // Blockchain & DeFi (30 topics)
  {
    category: "DeFi Protocols",
    topics: [
      "XRP's latest integration hints at a new payment revolution",
      "Cardano's sustainability focus gives it long-term investor appeal",
      "The shift from fiat to tokenized assets continues to accelerate",
      "Quant Network connects legacy finance with blockchain seamlessly",
      "Understanding liquidity pools: the backbone of DeFi",
      "Yield farming strategies for conservative investors",
      "How decentralized exchanges protect user privacy",
      "The rise of algorithmic stablecoins in volatile markets",
      "Cross-chain bridges: connecting isolated blockchains",
      "Flash loans explained: DeFi's most controversial feature",
      "Impermanent loss: what every liquidity provider must know",
      "The future of lending protocols without intermediaries",
      "How governance tokens give users real voting power",
      "Automated market makers vs traditional order books",
      "The role of oracles in DeFi smart contracts",
      "Understanding wrapped tokens and their use cases",
      "DeFi insurance: protecting against smart contract risks",
      "The evolution of decentralized derivatives trading",
      "How layer 2 solutions reduce DeFi transaction costs",
      "The legal challenges facing decentralized finance",
      "Real yield vs ponzi-nomics in DeFi protocols",
      "The emergence of decentralized identity solutions",
      "How DAOs are revolutionizing organizational structures",
      "The impact of MEV (Miner Extractable Value) on DeFi",
      "Comparing lending rates: DeFi vs traditional banks",
      "The role of collateralization in DeFi lending",
      "Understanding liquidity mining rewards and risks",
      "How DEX aggregators find the best swap rates",
      "The future of synthetic assets on blockchain",
      "DeFi composability: building money legos"
    ]
  },

  // NFTs & Digital Assets (20 topics)
  {
    category: "NFT & Digital Assets",
    topics: [
      "NFT utility beyond digital art: real-world applications",
      "How brands use NFTs for customer loyalty programs",
      "The rise of dynamic NFTs that evolve over time",
      "NFT fractionalization: democratizing expensive assets",
      "Understanding NFT royalties and creator economics",
      "The environmental impact of NFT minting explained",
      "How gaming NFTs create play-to-earn economies",
      "NFT marketplaces compared: OpenSea vs Blur vs Magic Eden",
      "The legal framework for NFT ownership and copyright",
      "How musicians monetize directly through NFT releases",
      "NFT ticketing: preventing scalpers and fraud",
      "The psychology behind NFT collecting and FOMO",
      "Understanding NFT metadata and on-chain storage",
      "How real estate NFTs could transform property sales",
      "The role of NFTs in the metaverse economy",
      "NFT lending protocols: using JPEGs as collateral",
      "The decline of PFP projects: lessons learned",
      "How NFTs verify authenticity for luxury goods",
      "Understanding ERC-721 vs ERC-1155 token standards",
      "The future of soulbound tokens and digital identity"
    ]
  },

  // Cryptocurrency Trading & Investment (25 topics)
  {
    category: "Market Insights",
    topics: [
      "Bitcoin halving cycles: predicting the next bull run",
      "Dollar-cost averaging: the safest crypto investment strategy",
      "Understanding crypto market capitalization vs circulating supply",
      "How to read candlestick charts for crypto trading",
      "The psychology of crypto FOMO and panic selling",
      "Tax implications of cryptocurrency trading in 2025",
      "How whales manipulate crypto prices through spoofing",
      "Understanding support and resistance levels in trading",
      "The role of stablecoins in portfolio risk management",
      "How to spot pump and dump schemes before it's too late",
      "Cryptocurrency correlation with traditional markets explained",
      "The impact of Federal Reserve policy on crypto prices",
      "Understanding leverage trading and liquidation risks",
      "How to use stop-loss orders effectively in crypto",
      "The difference between market and limit orders",
      "Reading on-chain metrics to predict price movements",
      "How exchange reserves indicate market sentiment",
      "The role of crypto Fear & Greed Index in timing trades",
      "Understanding realized vs unrealized profits in crypto",
      "How to build a diversified cryptocurrency portfolio",
      "The impact of Bitcoin ETF approvals on market structure",
      "Analyzing tokenomics before investing in altcoins",
      "How to identify undervalued cryptocurrencies early",
      "The role of technical analysis in crypto trading",
      "Understanding crypto market cycles and seasonal trends"
    ]
  },

  // Blockchain Technology (20 topics)
  {
    category: "Technology",
    topics: [
      "Proof of Work vs Proof of Stake: which is better?",
      "Understanding blockchain scalability: the trilemma explained",
      "How zero-knowledge proofs enhance blockchain privacy",
      "The evolution of consensus mechanisms beyond PoW and PoS",
      "Understanding sharding: Ethereum's scaling solution",
      "How layer 2 rollups achieve massive transaction throughput",
      "The role of validators in proof-of-stake networks",
      "Understanding blockchain finality and confirmation times",
      "How sidechains extend blockchain functionality",
      "The difference between permissioned and permissionless chains",
      "Understanding smart contract security vulnerabilities",
      "How blockchain enables supply chain transparency",
      "The role of IPFS in decentralized file storage",
      "Understanding blockchain interoperability protocols",
      "How threshold signatures improve multi-sig wallets",
      "The future of quantum-resistant blockchain cryptography",
      "Understanding Merkle trees and blockchain data structures",
      "How blockchain voting systems could transform democracy",
      "The role of blockchain in combating deepfakes",
      "Understanding tokenization of real-world assets"
    ]
  },

  // Crypto Regulation & Compliance (15 topics)
  {
    category: "Regulatory",
    topics: [
      "Understanding global crypto regulation: country-by-country guide",
      "How MiCA regulation affects European crypto businesses",
      "The SEC's approach to classifying crypto securities",
      "KYC and AML requirements for cryptocurrency exchanges",
      "The impact of travel rule on crypto transactions",
      "Understanding crypto tax reporting requirements",
      "How FATF guidelines shape global crypto compliance",
      "The legal status of stablecoins worldwide",
      "Understanding licensing requirements for crypto businesses",
      "The future of CBDCs and their impact on crypto",
      "How sanctions affect cryptocurrency transactions",
      "The role of regulatory sandboxes in crypto innovation",
      "Understanding the legal framework for DeFi protocols",
      "How anti-money laundering rules affect privacy coins",
      "The regulatory challenges of cross-border crypto payments"
    ]
  },

  // Web3 & Metaverse (15 topics)
  {
    category: "Web3 & Metaverse",
    topics: [
      "Understanding Web3: the decentralized internet explained",
      "How blockchain enables true digital ownership",
      "The role of crypto wallets in Web3 identity",
      "Understanding decentralized storage solutions",
      "How Web3 social networks differ from Web2 platforms",
      "The economics of metaverse virtual real estate",
      "Understanding interoperability between metaverse platforms",
      "How Web3 gaming rewards actual player ownership",
      "The role of tokenization in creator economies",
      "Understanding decentralized autonomous organizations",
      "How Web3 enables censorship-resistant publishing",
      "The future of work in metaverse virtual offices",
      "Understanding avatar identity and digital fashion",
      "How blockchain verifies digital scarcity",
      "The convergence of AI and Web3 technologies"
    ]
  },

  // Security & Privacy (12 topics)
  {
    category: "Security",
    topics: [
      "Understanding crypto wallet security best practices",
      "How hardware wallets protect against hacking attempts",
      "The importance of seed phrase backup strategies",
      "Understanding smart contract audit processes",
      "How to spot cryptocurrency phishing scams",
      "The role of multi-signature wallets in security",
      "Understanding cold storage vs hot wallets",
      "How to secure crypto assets during inheritance",
      "The dangers of connecting to unknown DApps",
      "Understanding rug pulls and how to avoid them",
      "How to use VPNs for enhanced crypto privacy",
      "The role of decentralized identity in security"
    ]
  },

  // Staking & Passive Income (13 topics)
  {
    category: "Staking & Yield",
    topics: [
      "Understanding proof-of-stake rewards and penalties",
      "How to choose the best staking validator",
      "The difference between staking and yield farming",
      "Understanding liquid staking derivatives",
      "How to calculate real APY after fees and taxes",
      "The risks of impermanent loss in liquidity providing",
      "Understanding lock-up periods in staking protocols",
      "How restaking amplifies rewards and risks",
      "The role of governance participation in staking",
      "Understanding validator slashing and how to avoid it",
      "How to earn passive income through lending protocols",
      "The tax implications of staking rewards",
      "Understanding auto-compounding strategies"
    ]
  }
];

// Calculate total topics
const totalTopics = BLOG_TOPICS.reduce((sum, cat) => sum + cat.topics.length, 0);

export default function BlogContentStrategy() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [completed, setCompleted] = useState([]);

  React.useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await User.me();
      setIsAdmin(user?.role === 'admin');
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const generateAllBlogs = async () => {
    if (!window.confirm(`This will generate ${totalTopics} blog posts. This will take approximately ${Math.ceil(totalTopics * 0.75)} minutes. Continue?`)) {
      return;
    }

    setIsGenerating(true);
    let generated = 0;
    const totalCount = totalTopics;
    setProgress({ current: 0, total: totalCount });

    for (const categoryGroup of BLOG_TOPICS) {
      for (const topic of categoryGroup.topics) {
        try {
          // Generate blog content
          const response = await InvokeLLM({
            prompt: `Generate a comprehensive, SEO-optimized blog post about "${topic}" for CryptoAI Central. 
            
Target audience: crypto enthusiasts, investors, and tech professionals.
Tone: informative, modern, trustworthy, and concise.
Length: 800-1200 words

Include:
- Engaging introduction with hook
- 3-5 main sections with subheadings
- Actionable insights and examples
- Conclusion with key takeaways
- Use markdown formatting with ## for headings

SEO Keywords to naturally include: ${categoryGroup.category}, blockchain, cryptocurrency, DeFi, Web3, AI, digital assets, crypto trading, smart contracts, decentralized finance

Return as JSON.`,
            response_json_schema: {
              type: "object",
              properties: {
                blog_title: { type: "string" },
                seo_keywords: { type: "array", items: { type: "string" } },
                blog_content_markdown: { type: "string" },
                excerpt: { type: "string" }
              },
              required: ["blog_title", "seo_keywords", "blog_content_markdown", "excerpt"]
            }
          });

          // Generate unique image
          const uniqueTimestamp = Date.now();
          const randomSeed = Math.random().toString(36).substring(7);
          
          const imagePrompt = `Create a professional, unique featured image for article: "${response.blog_title}"

Style: Modern, clean, professional financial technology illustration
Colors: Blue, purple, gold gradient palette
Composition: Abstract geometric shapes with technology theme
Theme: ${categoryGroup.category}
Unique markers: ${uniqueTimestamp}-${randomSeed}

Requirements:
- 16:9 aspect ratio, high quality
- Professional financial publication standard
- NO generic crypto symbols
- Abstract conceptual design
- NO text or human figures
- Completely unique visual`;

          const imageResponse = await GenerateImage({ prompt: imagePrompt });

          // Create slug
          const slug = response.blog_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

          // Create blog post
          await BlogPost.create({
            title: response.blog_title,
            slug: slug,
            content: response.blog_content_markdown,
            excerpt: response.excerpt || response.blog_content_markdown.substring(0, 150) + "...",
            category: categoryGroup.category,
            tags: response.seo_keywords.slice(0, 5),
            featured_image: imageResponse.url,
            published: false, // Requires admin approval
            ai_generated: true,
            reading_time: Math.ceil(response.blog_content_markdown.split(" ").length / 200),
            author_name: "Joe Robertson"
          });

          generated++;
          setProgress({ current: generated, total: totalCount });
          setCompleted(prev => [...prev, response.blog_title]);

          // Safety delay (45 seconds between posts to avoid rate limits)
          if (generated < totalCount) {
            await new Promise(resolve => setTimeout(resolve, 45000));
          }

        } catch (error) {
          console.error(`Failed to generate: ${topic}`, error);
        }
      }
    }

    setIsGenerating(false);
    alert(`Generated ${generated} blog posts successfully! They are now pending approval in the Admin panel.`);
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-slate-600 mt-2">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Content Strategy Generator</h1>
          <p className="text-lg text-slate-600">
            Comprehensive 175-blog plan for Crypto & AI niche
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Content Overview</span>
              <Badge variant="secondary">{totalTopics} Total Topics</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {BLOG_TOPICS.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900">{category.category}</h3>
                    <p className="text-sm text-slate-600">{category.topics.length} blog topics</p>
                  </div>
                  <Badge>{category.topics.length}</Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Generation Details:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Each post: 800-1200 words with unique AI-generated image</li>
                <li>• Estimated time: ~{Math.ceil(totalTopics * 0.75)} minutes (45 seconds per post)</li>
                <li>• All posts require admin approval before publishing</li>
                <li>• SEO-optimized with relevant keywords and meta descriptions</li>
              </ul>
            </div>

            {!isGenerating ? (
              <Button 
                onClick={generateAllBlogs}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate All {totalTopics} Blog Posts
              </Button>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Generating... {progress.current} / {progress.total}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Please wait... This will take about {Math.ceil((progress.total - progress.current) * 0.75)} more minutes</span>
                </div>
                {completed.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Recently Completed:
                    </h4>
                    <div className="space-y-1">
                      {completed.slice(-10).reverse().map((title, idx) => (
                        <div key={idx} className="text-sm text-green-800">• {title}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Full Topic List ({totalTopics} Topics)</CardTitle>
          </CardHeader>
          <CardContent>
            {BLOG_TOPICS.map((category, catIdx) => (
              <div key={catIdx} className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  {category.category}
                  <Badge variant="secondary">{category.topics.length}</Badge>
                </h3>
                <div className="space-y-2">
                  {category.topics.map((topic, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-mono text-slate-500 mt-0.5">{catIdx + 1}.{idx + 1}</span>
                      <span className="text-slate-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}