import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Twitter, Linkedin, Facebook, Instagram, Loader2, Check, Sparkles, Clock, Image as ImageIcon } from 'lucide-react';

const PLATFORM_TEMPLATES = {
  twitter: {
    max_length: 280,
    icon: Twitter,
    color: 'text-blue-500',
    templates: [
      "🚀 New Blog Post: {title}\n\n{excerpt}\n\n{hashtags}",
      "📖 Just published: {title}\n\n{key_points}\n\nRead more: {hashtags}",
      "🔥 Hot off the press: {title}\n\n{question}\n\n{hashtags}",
      "💡 Insightful read: {title}\n\n{statistic}\n\n{hashtags}"
    ]
  },
  linkedin: {
    max_length: 1300,
    icon: Linkedin,
    color: 'text-blue-700',
    templates: [
      "I'm excited to share my latest article: {title}\n\n{excerpt}\n\nKey takeaways:\n{key_points}\n\n{hashtags}",
      "New blog post alert: {title}\n\n{excerpt}\n\nThis topic is particularly relevant because {insight}\n\n{hashtags}",
      "Just published: {title}\n\n{excerpt}\n\nWhat are your thoughts on this? I'd love to hear your perspective in the comments. 👇\n\n{hashtags}"
    ]
  },
  facebook: {
    max_length: 2000,
    icon: Facebook,
    color: 'text-blue-600',
    templates: [
      "📚 New blog post is live! {title}\n\n{excerpt}\n\nWhat do you think about this topic? Share your thoughts below! 💬\n\n{hashtags}",
      "Just published: {title}\n\n{excerpt}\n\n{question} Let me know what you think! 👇\n\n{hashtags}",
      "🔥 New content alert: {title}\n\n{excerpt}\n\nThis is something every {audience} should know about!\n\n{hashtags}"
    ]
  },
  instagram: {
    max_length: 2200,
    icon: Instagram,
    color: 'text-pink-600',
    templates: [
      "✨ New Blog Post ✨\n\n{title}\n\n{excerpt}\n\n{key_points}\n\n{hashtags}",
      "📖 JUST PUBLISHED 📖\n\n{title}\n\n{excerpt}\n\nSwipe up to read the full article! 👆\n\n{hashtags}",
      "💡 EDUCATION TIME 💡\n\n{title}\n\n{excerpt}\n\nSave this post for later! 📌\n\n{hashtags}"
    ]
  }
};

const HASHTAG_LIBRARY = {
  Technology: ["#Tech", "#Innovation", "#DigitalTransformation", "#AI", "#MachineLearning"],
  Crypto: ["#Crypto", "#Bitcoin", "#Ethereum", "#Blockchain", "#DeFi"],
  AI: ["#ArtificialIntelligence", "#AI", "#MachineLearning", "#DeepLearning", "#DataScience"],
  News: ["#CryptoNews", "#Breaking", "#Update", "#Latest", "#News"],
  Analysis: ["#Analysis", "#Insights", "#Data", "#Research", "#Trends"],
  Tutorial: ["#Tutorial", "#Guide", "#HowTo", "#Learn", "#Education"],
  Review: ["#Review", "#Analysis", "#Opinion", "#Comparison", "#ProductReview"],
  "Industry Update": ["#Industry", "#Business", "#Enterprise", "#Adoption", "#Market"],
  "Market Insights": ["#Market", "#Trading", "#Investment", "#Finance", "#Crypto"],
  Tax: ["#Tax", "#Finance", "#Accounting", "#Regulation", "#Compliance"]
};

const BEST_POSTING_TIMES = {
  twitter: ["9:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
  linkedin: ["7:00 AM", "9:00 AM", "12:00 PM", "5:00 PM"],
  facebook: ["1:00 PM", "3:00 PM", "7:00 PM", "9:00 PM"],
  instagram: ["8:00 AM", "12:00 PM", "4:00 PM", "7:00 PM"]
};

const IMAGE_RATIOS = {
  twitter: "16:9",
  linkedin: "1:1",
  facebook: "1.91:1",
  instagram: "1:1"
};

export default function SocialMediaThreadGenerator({ post }) {
  const [generatedPosts, setGeneratedPosts] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('twitter');

  // _generate_excerpt
  const generateExcerpt = (content, platform) => {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    
    if (!paragraphs.length) {
      return "Check out our latest blog post for valuable insights!";
    }
    
    let firstPara = paragraphs[0];
    firstPara = firstPara.replace(/^#+\s*/gm, '');
    firstPara = firstPara.replace(/\*+/g, '');
    
    const maxLengths = {
      twitter: 150,
      linkedin: 300,
      facebook: 250,
      instagram: 200
    };
    
    const maxLen = maxLengths[platform] || 200;
    
    if (firstPara.length > maxLen) {
      firstPara = firstPara.substring(0, maxLen - 3) + "...";
    }
    
    return firstPara;
  };

  // _extract_key_points
  const extractKeyPoints = (content) => {
    const keyPoints = [];
    
    const bulletPattern = /^[-*•]\s*\*?\*?(.*?)\*?\*?$/gm;
    let match;
    
    while ((match = bulletPattern.exec(content)) !== null) {
      if (match[1].trim().length > 15) {
        keyPoints.push(match[1].trim());
      }
    }
    
    if (keyPoints.length < 3) {
      const sectionPattern = /^##\s+(.+)$/gm;
      while ((match = sectionPattern.exec(content)) !== null) {
        const section = match[1].trim();
        if (!section.toLowerCase().includes('introduction') &&
            !section.toLowerCase().includes('conclusion')) {
          keyPoints.push(section);
        }
      }
    }
    
    if (keyPoints.length === 0) {
      return "• Essential strategies and insights\n• Practical implementation tips\n• Future trends and predictions";
    }
    
    return keyPoints.slice(0, 3).map(p => `• ${p}`).join('\n');
  };

  // _generate_hashtags
  const generateHashtags = (platform) => {
    const category = post.category || 'Technology';
    const categoryHashtags = HASHTAG_LIBRARY[category] || HASHTAG_LIBRARY['Technology'];
    
    const titleKeywords = post.title.match(/\b[a-zA-Z]{4,}\b/g) || [];
    const titleHashtags = titleKeywords.slice(0, 3).map(w => `#${w}`);
    
    const maxHashtags = {
      twitter: 3,
      linkedin: 5,
      facebook: 4,
      instagram: 10
    };
    
    const maxCount = maxHashtags[platform] || 5;
    const allHashtags = [...titleHashtags, ...categoryHashtags];
    
    return allHashtags.slice(0, maxCount).join(' ');
  };

  // _generate_engagement_question
  const generateEngagementQuestion = () => {
    const titlePart = post.title.split(':')[0] || post.title.split(' ')[0];
    const questions = [
      `What's your experience with ${titlePart.toLowerCase()}?`,
      `How has ${titlePart.toLowerCase()} impacted your work?`,
      `What's the biggest challenge you face with ${titlePart.toLowerCase()}?`,
      `Where do you see the future of ${titlePart.toLowerCase()} heading?`,
      `What's your top tip for mastering ${titlePart.toLowerCase()}?`
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  };

  // _generate_statistic
  const generateStatistic = () => {
    const category = post.category || 'Technology';
    const stats = {
      Technology: "85% of businesses see improved efficiency with proper tech implementation",
      AI: "AI adoption has grown by 270% in the past 4 years",
      Crypto: "Over 300 million people worldwide now use cryptocurrency",
      News: "Readers who engage with educational content show 40% better retention",
      Analysis: "Data-driven decisions improve outcomes by 60%"
    };
    return stats[category] || stats.Technology;
  };

  // _generate_insight
  const generateInsight = () => {
    const category = post.category || 'Technology';
    const insights = {
      Technology: "staying ahead of tech trends is no longer optional for business survival",
      AI: "AI is transforming every industry from healthcare to finance",
      Crypto: "blockchain technology is creating new economic opportunities worldwide",
      News: "continuous learning is essential in our rapidly changing world",
      Analysis: "data-driven insights are the key to competitive advantage"
    };
    return insights[category] || insights.Technology;
  };

  // _get_target_audience
  const getTargetAudience = () => {
    const category = post.category || 'Technology';
    const audiences = {
      Technology: "tech professional",
      AI: "AI enthusiast",
      Crypto: "crypto investor",
      News: "industry professional",
      Analysis: "business analyst"
    };
    return audiences[category] || audiences.Technology;
  };

  // _truncate_content
  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) {
      return content;
    }
    
    const sentences = content.split('. ');
    let truncated = "";
    
    for (const sentence of sentences) {
      if ((truncated + sentence + '. ').length <= maxLength - 3) {
        truncated += sentence + '. ';
      } else {
        break;
      }
    }
    
    if (truncated) {
      return truncated.trim() + "...";
    }
    
    return content.substring(0, maxLength - 3) + "...";
  };

  // _generate_platform_post
  const generatePlatformPost = (platform, variationIndex) => {
    const config = PLATFORM_TEMPLATES[platform];
    const template = config.templates[variationIndex % config.templates.length];
    
    const templateData = {
      title: post.title,
      excerpt: generateExcerpt(post.content, platform),
      key_points: extractKeyPoints(post.content),
      hashtags: generateHashtags(platform),
      question: generateEngagementQuestion(),
      statistic: generateStatistic(),
      insight: generateInsight(),
      audience: getTargetAudience()
    };
    
    let content = template;
    for (const [key, value] of Object.entries(templateData)) {
      content = content.replace(`{${key}}`, value);
    }
    
    content = truncateContent(content, config.max_length);
    
    return {
      platform,
      content,
      character_count: content.length,
      hashtags: templateData.hashtags,
      image_ratio: IMAGE_RATIOS[platform],
      posting_times: BEST_POSTING_TIMES[platform]
    };
  };

  // generate_social_posts
  const generateAllPosts = () => {
    setIsGenerating(true);
    try {
      const allPosts = {};
      
      for (const platform of ['twitter', 'linkedin', 'facebook', 'instagram']) {
        const platformPosts = [];
        const numVariations = PLATFORM_TEMPLATES[platform].templates.length;
        
        for (let i = 0; i < numVariations; i++) {
          platformPosts.push(generatePlatformPost(platform, i));
        }
        
        allPosts[platform] = platformPosts;
      }
      
      setGeneratedPosts(allPosts);
    } catch (error) {
      console.error('Error generating posts:', error);
      alert('Failed to generate posts');
    }
    setIsGenerating(false);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const hasGeneratedPosts = Object.keys(generatedPosts).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Social Media Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasGeneratedPosts ? (
          <>
            <Alert className="mb-4">
              <AlertDescription>
                Generate professional social media posts for Twitter, LinkedIn, Facebook, and Instagram with platform-optimized content, hashtags, and posting times.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={generateAllPosts}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Posts...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Social Media Kit
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                {Object.keys(generatedPosts).map((platform) => {
                  const Icon = PLATFORM_TEMPLATES[platform].icon;
                  const color = PLATFORM_TEMPLATES[platform].color;
                  return (
                    <TabsTrigger key={platform} value={platform} className="capitalize">
                      <Icon className={`w-4 h-4 mr-1 ${color}`} />
                      {platform}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(generatedPosts).map(([platform, posts]) => (
                <TabsContent key={platform} value={platform} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">
                      {posts.length} variations • Max {PLATFORM_TEMPLATES[platform].max_length} chars
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Best times: {posts[0].posting_times.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {posts.map((postData, index) => {
                      const Icon = PLATFORM_TEMPLATES[platform].icon;
                      return (
                        <Card key={index} className={`border-l-4 ${platform === 'twitter' ? 'border-blue-500' : platform === 'linkedin' ? 'border-blue-700' : platform === 'facebook' ? 'border-blue-600' : 'border-pink-600'}`}>
                          <CardContent className="pt-4">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${PLATFORM_TEMPLATES[platform].color}`} />
                                <Badge variant="outline">Variation {index + 1}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  {postData.image_ratio}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-start gap-3">
                              <Textarea
                                value={postData.content}
                                readOnly
                                className="min-h-[150px] font-mono text-sm resize-none"
                              />
                              <Button
                                onClick={() => copyToClipboard(postData.content, `${platform}-${index}`)}
                                variant="ghost"
                                size="sm"
                                className="flex-shrink-0"
                              >
                                {copiedIndex === `${platform}-${index}` ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            
                            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                              <span>{postData.character_count} / {PLATFORM_TEMPLATES[platform].max_length} characters</span>
                              <span className="text-xs text-slate-400">{postData.hashtags.split(' ').length} hashtags</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => setGeneratedPosts({})} 
                variant="outline"
                className="flex-1"
              >
                Generate New Posts
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}