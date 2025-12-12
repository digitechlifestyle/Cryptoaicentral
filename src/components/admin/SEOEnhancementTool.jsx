import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SEOEnhancementTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const enhancePostSEO = async (post) => {
    try {
      // First, enhance the content for SEO
      const contentResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Enhance this blog post for SEO while keeping the content structure and maintaining readability.

**TITLE:** ${post.title}
**CONTENT:** ${post.content}

**YOUR TASK:**
Enhance the content for SEO by:
1. Naturally integrating relevant keywords (crypto, blockchain, AI, Web3, DeFi, etc.)
2. Improving meta descriptions and excerpts
3. Adding internal linking suggestions
4. Optimizing headings for search intent
5. Maintaining readability and user engagement

**MAINTAIN:**
- All existing markdown structure (## H2, ### H3)
- All spacing and formatting
- All factual information
- Natural, conversational tone

**FOCUS ON:**
- Keyword density (1-2% for main keywords)
- LSI keywords (related terms)
- Search intent optimization
- Featured snippet optimization

Output ONLY the SEO-enhanced markdown content:`,
      });

      let enhancedContent = contentResponse.text_response || contentResponse;
      enhancedContent = enhancedContent.replace(/^```markdown\n?/gm, '').replace(/\n?```$/gm, '').trim();

      // Then, generate better SEO metadata
      const metaResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate SEO-optimized metadata for this blog post:

**TITLE:** ${post.title}
**CONTENT PREVIEW:** ${enhancedContent.substring(0, 500)}...

Generate:
1. An optimized title (50-60 characters, keyword-rich)
2. A compelling meta description (150-160 characters)
3. 5-7 relevant SEO keywords/tags

Return as JSON:`,
        response_json_schema: {
          type: "object",
          properties: {
            optimized_title: { type: "string" },
            meta_description: { type: "string" },
            seo_keywords: { type: "array", items: { type: "string" } }
          }
        }
      });

      await base44.entities.BlogPost.update(post.id, {
        title: metaResponse.optimized_title || post.title,
        content: enhancedContent,
        excerpt: metaResponse.meta_description || post.excerpt,
        tags: metaResponse.seo_keywords || post.tags
      });

      return { success: true, title: post.title };
    } catch (error) {
      console.error(`SEO enhancement error for "${post.title}":`, error);
      return { success: false, title: post.title, error: error.message };
    }
  };

  const handleEnhanceAll = async () => {
    if (!window.confirm('Enhance SEO for ALL blog posts? This takes about 8-10 seconds per post. Continue?')) {
      return;
    }

    setIsProcessing(true);
    setError('');
    setResults([]);

    try {
      const posts = await base44.entities.BlogPost.list('-created_date', 200);
      
      if (posts.length === 0) {
        setError('No blog posts found.');
        setIsProcessing(false);
        return;
      }

      setProgress({ current: 0, total: posts.length });

      const enhanceResults = [];
      for (let i = 0; i < posts.length; i++) {
        const result = await enhancePostSEO(posts[i]);
        enhanceResults.push(result);
        setProgress({ current: i + 1, total: posts.length });
        setResults([...enhanceResults]);
        
        if (i < posts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

    } catch (error) {
      console.error('Bulk SEO enhancement error:', error);
      setError('Failed to enhance posts: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="w-7 h-7 text-orange-600" />
          SEO Content Enhancement
        </CardTitle>
        <CardDescription className="text-base">
          Optimize all blog posts for search engines while maintaining readability.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium text-slate-700">
              <span>Enhancing SEO...</span>
              <span className="text-orange-600">{progress.current} of {progress.total}</span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-3" />
            <p className="text-xs text-slate-500 text-center">
              Optimizing content for search engines. Please don't close this tab.
              <br />
              Estimated time remaining: {Math.ceil((progress.total - progress.current) * 8 / 60)} minutes
            </p>
          </div>
        )}

        {results.length > 0 && !isProcessing && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800 text-lg font-bold">SEO Enhancement Complete!</AlertTitle>
            <AlertDescription className="text-green-700 text-base">
              Successfully enhanced <strong>{successCount}</strong> post{successCount !== 1 ? 's' : ''}.
              {failureCount > 0 && ` ${failureCount} failed (check console).`}
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto border-2 border-slate-200 rounded-lg p-4 space-y-2 bg-slate-50">
            <h3 className="font-semibold text-slate-700 mb-3 sticky top-0 bg-slate-50 pb-2">
              Enhanced Posts ({results.length}):
            </h3>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border text-sm hover:shadow-sm transition-shadow">
                <span className="truncate flex-1 font-medium text-slate-800">{result.title}</span>
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-3" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-3" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-2">What This Tool Does:</h4>
          <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
            <li>Naturally integrates relevant keywords throughout content</li>
            <li>Optimizes titles and meta descriptions for click-through rates</li>
            <li>Improves keyword density without keyword stuffing</li>
            <li>Adds LSI (Latent Semantic Indexing) keywords</li>
            <li>Optimizes headings for search intent</li>
            <li>Enhances content for featured snippets</li>
            <li>Maintains readability and user engagement</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important:</h4>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>This will enhance ALL blog posts for SEO</li>
            <li>Content structure and formatting are preserved</li>
            <li>Keywords are integrated naturally</li>
            <li>Takes 8-10 seconds per post</li>
          </ul>
        </div>

        <Button
          onClick={handleEnhanceAll}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-6 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Enhancing... ({progress.current}/{progress.total})
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 mr-2" />
              Enhance All Posts for SEO
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}