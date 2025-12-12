
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input'; // Assuming Input component is available
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { InvokeLLM, GenerateImage } from '@/api/integrations';
import { BlogPost } from '@/api/entities';

export default function BulkBlogGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 175 });
  const [completed, setCompleted] = useState([]);
  const [failed, setFailed] = useState([]);
  const [imageProvider, setImageProvider] = useState('default'); // Added state for image provider
  const [totalToGenerate, setTotalToGenerate] = useState(175); // Added state for total to generate

  const SEO_KEYWORDS = [
    'AI', 'blockchain', 'cryptocurrency', 'Bitcoin', 'Ethereum', 'XRP', 'Cardano',
    'Solana', 'Hedera', 'Web3', 'tokenization', 'DeFi', 'Quant', 'automation',
    'machine learning', 'smart contracts', 'digital assets', 'NFT', 'Layer 2',
    'staking', 'yield farming', 'decentralized', 'oracle', 'cross-chain'
  ];

  const BLOG_CATEGORIES = [
    'AI & Productivity', 'DeFi Protocols', 'NFT & Digital Assets', 'Layer 2 Scaling',
    'Smart Contracts', 'Tokenization', 'Blockchain Infrastructure', 'Crypto Trading',
    'Web3 Development', 'Crypto Security', 'Market Analysis', 'Technology',
    'Industry Update', 'News', 'Tutorial', 'Review'
  ];

  const generateBlogBatch = async (batchNumber, batchSize = 5) => {
    try {
      // Assuming base44.integrations.Core is available globally or imported as InvokeLLM and GenerateImage are.
      // Based on the import, InvokeLLM is directly imported, so I will stick to that.
      const response = await InvokeLLM({
        prompt: `Generate ${batchSize} SEO-optimized blog posts for a crypto/AI website in 2025.

**CRITICAL RULES:**
1. Output ONLY valid JSON - no explanations, no markdown wrappers
2. Each blog must use proper markdown structure with ## headings
3. Follow the EXACT structure template provided
4. Content must be 1,800-2,500 words per post
5. Include blank lines between ALL paragraphs
6. Focus on 2025 trends and updates

**REQUIRED MARKDOWN STRUCTURE FOR EACH BLOG:**

## Introduction
[2-3 engaging paragraphs with 2025 context]
**TL;DR:** [2-3 sentences]

## What Is [Topic]?
[Definition paragraphs]

### Core Characteristics
- **Characteristic 1**: [Explanation]
- **Characteristic 2**: [Explanation]
- **Characteristic 3**: [Explanation]

💡 **Key Takeaway**: [Summary sentence]

## Types and Categories

### Type 1: [Name]
**Definition:** [Explanation]
**Key Features:**
- [Feature]
- [Feature]
**Best For:** [Use case]

### Type 2: [Name]
[Same structure]

### Comparison Table
| Type | Features | Best For | Cost |
|------|----------|----------|------|
| Type 1 | [Info] | [Use] | [Price] |

🎯 **Pro Tip**: [Advice]

## Leading Examples
### 1. [Platform Name]
**Overview:** [Description]
**Features:**
- [Feature 1]
- [Feature 2]

## How It Works
[Process explanation]

### The Process
1. **Step 1**: [Details]
2. **Step 2**: [Details]

## Security and Risk Management
### Common Risks
1. **Risk 1**: Description, Impact, Mitigation
2. **Risk 2**: [Same]

### Best Practices
- ✅ [Practice 1]
- ✅ [Practice 2]

## Tools and Strategies
### Recommended Tools
1. **[Tool]**: Purpose, features

### Strategies
**For Beginners:**
- [Strategy]

**For Advanced:**
- [Strategy]

## Regulatory Landscape
### Global Regulations
- **US**: [Info]
- **EU**: [Info]

## Future Trends
### Coming in 2025-2028
1. **Trend 1**: Description, impact, timeline
2. **Trend 2**: [Same]

## How to Choose
### Decision Framework
**Must-Have:**
- [ ] [Feature]

### Evaluation Factors
1. **Cost**: [Considerations]
2. **Security**: [Factors]

### Recommendations
**Beginners**: [Specific recommendations]
**Advanced**: [Recommendations]

## FAQ
**Q: [Question]?**
A: [Answer]

[Repeat for 6 questions]

## Conclusion
[Summary and next steps for 2025]

🎯 **Final Tip**: [Closing advice]

**GENERATE ${batchSize} COMPLETE POSTS** across these categories: ${BLOG_CATEGORIES.slice(batchNumber % 8, (batchNumber % 8) + 4).join(', ')}

Return as JSON array:
{
  "blogs": [
    {
      "title": "string (include '2025' in title)",
      "category": "string",
      "tags": ["tag1", "tag2"],
      "content": "FULL MARKDOWN CONTENT WITH ## HEADINGS"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            blogs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  category: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                  content: { type: "string" }
                },
                required: ["title", "category", "tags", "content"]
              }
            }
          }
        }
      });

      return response.blogs;
    } catch (error) {
      console.error('Batch generation failed:', error);
      return [];
    }
  };

  const createBlogPost = async (blogData, index) => {
    try {
      const timestamp = Date.now();
      const uniqueSeed = Math.random().toString(36).substring(7);
      const titleHash = blogData.title.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);

      const visualStyles = [
        'abstract flowing data streams with glowing nodes',
        'geometric network patterns with golden highlights',
        'particle system visualization in gradient tones',
        'circuit board pathways with energy flows',
        'crystalline network structures',
        'holographic interface design',
        'isometric 3D wireframe networks',
        'liquid gradient flows',
        'low-poly faceted surfaces with lighting',
        'glowing wireframe networks'
      ];

      const colorSchemes = [
        'electric blue and cyan with purple',
        'indigo and gold with white',
        'teal and orange complementary',
        'violet and lime contrast',
        'navy and amber warm tones',
        'turquoise and coral vibrant',
        'emerald and silver metallic',
        'crimson and ice blue',
        'sunset orange and purple',
        'cobalt and tangerine'
      ];

      const randomStyle = visualStyles[Math.floor(Math.random() * visualStyles.length)];
      const randomColors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

      const imagePrompt = `Professional editorial illustration for "${blogData.title}"

TECHNICAL SPECS:
- Aspect ratio: 16:9 landscape, high-resolution
- Style: ${randomStyle}
- Color palette: ${randomColors}
- Quality: Publication-grade
- Unique identifiers: seed=${uniqueSeed}, timestamp=${timestamp}, hash=${titleHash}

CONTENT THEME:
- Main topic: ${blogData.title}
- Category: ${blogData.category}
- Keywords: ${blogData.tags.slice(0, 3).join(', ')}

CRITICAL RULES - MUST FOLLOW:
❌ NO text, letters, numbers, or words
❌ NO Bitcoin logos, Ethereum symbols, or ANY crypto logos
❌ NO coins, currency symbols, or coin imagery  
❌ NO human figures, faces, or people
❌ NO specific brand logos or company marks
❌ NO literal representations

✅ ONLY ABSTRACT: 
- Flowing data patterns
- Geometric network structures
- Particle systems
- Circuit pathways
- Gradient flows
- Light effects
- Wireframe networks
- Energy streams

DESIGN APPROACH:
Modern financial technology publication aesthetic. Create a distinctive ABSTRACT image that communicates "${blogData.title}" through pure visual design - geometric patterns, flowing energy, network connections, and technological elements ONLY.`;

      let imageResponse;

      if (imageProvider === 'fal') {
        throw new Error('fal.ai integration not configured yet. Please request activation.');
      } else {
        imageResponse = await GenerateImage({ prompt: imagePrompt });
      }

      if (!imageResponse || !imageResponse.url) {
        throw new Error('Image generation failed');
      }

      // The full content is now directly provided by the LLM
      const fullContent = blogData.content;

      // Create excerpt from the first few paragraphs of the full content
      const contentLines = fullContent.split('\n');
      let excerpt = '';
      let paragraphCount = 0;
      for (const line of contentLines) {
          const trimmedLine = line.trim();
          if (trimmedLine.length === 0) continue; // Skip empty lines
          // Skip headings, callout boxes, list items, blockquotes, markdown directives
          if (trimmedLine.startsWith('#') || trimmedLine.startsWith('💡') || trimmedLine.startsWith('🎯') || trimmedLine.startsWith('✅') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('>') || trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
              continue;
          }
          if (paragraphCount < 2) { // Take up to two introductory paragraphs
              excerpt += (excerpt.length > 0 ? '\n\n' : '') + trimmedLine;
              paragraphCount++;
          }
          if (paragraphCount >= 2 && trimmedLine.length > 0) break; // Stop after first two paragraphs
      }
      excerpt = excerpt.substring(0, 250) + (excerpt.length > 250 ? '...' : ''); // Ensure it's not too long

      // Create slug
      const slug = blogData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create blog post
      await BlogPost.create({
        title: blogData.title,
        slug: slug,
        content: fullContent, // Use the full content from LLM
        excerpt: excerpt,     // Derived from fullContent
        category: blogData.category,
        tags: blogData.tags,
        featured_image: imageResponse.url,
        published: false, // Require admin approval
        ai_generated: true,
        reading_time: Math.ceil(fullContent.split(' ').length / 200), // Recalculate based on full content
        author_name: "Joe Robertson"
      });

      return { success: true, title: blogData.title };
    } catch (error) {
      console.error(`Failed to create blog: ${blogData.title}`, error);
      return { success: false, title: blogData.title, error: error.message };
    }
  };

  const handleBulkGenerate = async () => { // Renamed and adapted from generateAll175Blogs
    const confirmMsg = `Generate ${totalToGenerate} SEO-optimized, full-length blog posts?

This will:
✓ Generates full-length, detailed content for each post (1200-1800 words)
✓ Generate custom images (4 seconds each)
✓ All posts sent for moderation (unpublished)
✓ Estimated time: ~${Math.ceil((totalToGenerate * 4) / 60)} - ${Math.ceil((totalToGenerate * 4 + (totalToGenerate / 5) * 5) / 60)} minutes (depending on batch processing)

The process cannot be stopped once started.
Continue?`;

    if (!window.confirm(confirmMsg)) return;

    setIsGenerating(true);
    setProgress({ current: 0, total: totalToGenerate });
    setCompleted([]);
    setFailed([]);

    let totalCreated = 0;
    const batchSize = 5; // Generate 5 blogs per batch
    const numBatches = Math.ceil(totalToGenerate / batchSize);

    for (let i = 0; i < numBatches; i++) {
      console.log(`\n═══ Batch ${i + 1}/${numBatches} ═══`);

      // Generate batch of blog data
      const blogsInThisBatch = Math.min(batchSize, totalToGenerate - totalCreated);
      const blogDataArray = await generateBlogBatch(i, blogsInThisBatch);

      if (blogDataArray.length === 0) {
        console.error(`Batch ${i + 1} failed or returned no blogs - skipping`);
        // If a batch fails entirely, we should still count the expected posts against the total for progress,
        // but mark them as failed. Or adjust total created. For simplicity, let's just skip and let progress catch up.
        // Or better, add dummy failed entries for the expected batch size.
        for(let j=0; j<blogsInThisBatch; j++){
            setFailed(prev => [...prev, `Batch ${i+1} Item ${j+1} failed: No data returned from LLM`]);
        }
        setProgress(prev => ({ ...prev, current: prev.current + blogsInThisBatch }));
        continue;
      }

      // Create each blog with image
      for (const blogData of blogDataArray) {
        if (totalCreated >= totalToGenerate) break; // Ensure we don't exceed the requested amount

        const result = await createBlogPost(blogData, totalCreated);

        if (result.success) {
          totalCreated++;
          setCompleted(prev => [...prev, result.title]);
          console.log(`✓ Created: ${result.title} (${totalCreated}/${totalToGenerate})`);
        } else {
          setFailed(prev => [...prev, `${result.title || 'Unknown Title'}: ${result.error}`]);
          console.error(`✗ Failed: ${result.title || 'Unknown Title'}`);
        }

        setProgress({ current: totalCreated, total: totalToGenerate });

        // 4 second delay between posts (for image generation rate limiting)
        if (totalCreated < totalToGenerate) { // Don't delay after the very last post
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }

      // Additional 5 second delay between batches
      if (i < numBatches - 1 && totalCreated < totalToGenerate) {
        console.log('⏳ Cooling down before next batch...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    setIsGenerating(false);

    const summary = `Blog Generation Complete!

✓ Successfully created: ${totalCreated} full-length posts
✗ Failed: ${failed.length} posts

All posts require approval in the Blog tab before publishing.`;

    alert(summary);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold">Bulk Blog Generator</h3>
            <p className="text-sm text-slate-600 font-normal mt-1">Generate multiple SEO-optimized blog posts at once</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="imageProviderSelect" className="text-sm font-normal">Image Provider:</label>
              <select
                id="imageProviderSelect"
                value={imageProvider}
                onChange={(e) => setImageProvider(e.target.value)}
                className="text-sm border rounded px-2 py-1"
                disabled={isGenerating}
              >
                <option value="default">Default (Core)</option>
                <option value="fal">fal.ai (Request Required)</option>
              </select>
            </div>
            <Input
              type="number"
              min="1"
              max="175"
              value={totalToGenerate}
              onChange={(e) => setTotalToGenerate(Math.min(175, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-20"
              disabled={isGenerating}
            />
            <Button
              onClick={handleBulkGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {progress.current}/{progress.total}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate {totalToGenerate} Posts
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageProvider === 'fal' && (
            <Alert className="mb-4 border-blue-500">
                <AlertTitle className="font-bold text-blue-800">🚀 fal.ai Integration</AlertTitle>
                <AlertDescription className="text-blue-700">
                    <p className="mb-2">fal.ai offers faster, higher-quality image generation. To enable:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Dashboard → Settings → Enable "Backend Functions"</li>
                        <li>Use Feedback button to request "fal.ai integration"</li>
                        <li>base44 team will configure the integration</li>
                    </ol>
                </AlertDescription>
            </Alert>
        )}

        {/* Info Box */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">What this does:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Generates {totalToGenerate} unique blog posts across 16 crypto/AI categories</li>
                <li>• Each post is a full-length article (1200-1800 words) with structured headings, value-adds, and a conversational tone</li>
                <li>• Custom AI-generated image for every post (all unique)</li>
                <li>• SEO keywords integrated naturally throughout</li>
                <li>• All posts set to "unpublished" for your review</li>
              </ul>
              <p className="font-semibold mt-3">Time estimate:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• ~4 seconds per post (image generation)</li>
                <li>• Batches of 5 posts every ~30 seconds</li>
                <li>• Total time: approximately {Math.ceil((totalToGenerate * 4) / 60)} - {Math.ceil((totalToGenerate * 4 + (totalToGenerate / 5) * 5) / 60)} minutes</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* SEO Keywords Badge */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">SEO Keywords:</p>
          <div className="flex flex-wrap gap-2">
            {SEO_KEYWORDS.map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Generate Button (now integrated into CardTitle actions) */}
        {isGenerating && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Generating Posts...</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  Estimated time remaining: {Math.ceil(((progress.total - progress.current) * 4) / 60)} minutes
                </span>
              </div>
            </div>

            {/* Recent Completions */}
            {completed.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 max-h-64 overflow-y-auto">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Recently Created ({completed.length}):
                </h4>
                <div className="space-y-1">
                  {completed.slice(-10).reverse().map((title, idx) => (
                    <div key={idx} className="text-sm text-green-800">✓ {title}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Failures */}
            {failed.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 max-h-32 overflow-y-auto">
                <h4 className="font-semibold text-red-900 mb-2">Failed ({failed.length}):</h4>
                <div className="space-y-1">
                  {failed.map((error, idx) => (
                    <div key={idx} className="text-sm text-red-800">✗ {error}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warning */}
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            <strong>Important:</strong> Do not close this tab during generation. All posts will be created as "unpublished" and require your approval in the Blog tab before going live.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
