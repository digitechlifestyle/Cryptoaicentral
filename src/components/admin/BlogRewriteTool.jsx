import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileEdit, CheckCircle, AlertCircle, Wand2, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BlogRewriteTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [postsCount, setPostsCount] = useState(0);

  React.useEffect(() => {
    checkPosts();
  }, []);

  const checkPosts = async () => {
    try {
      const posts = await base44.entities.BlogPost.list('-created_date', 1);
      setPostsCount(posts.length);
    } catch (error) {
      console.error('Error checking posts:', error);
    }
  };

  const rewritePost = async (post) => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Rewrite this blog post to be more engaging, comprehensive, and SEO-optimized while maintaining all factual information.

**ORIGINAL TITLE:** ${post.title}

**ORIGINAL CONTENT:**
${post.content}

**YOUR TASK:**
Rewrite this article to be MORE:
- Engaging and conversational (while staying professional)
- Comprehensive with deeper insights
- SEO-optimized with natural keyword integration
- Well-structured with clear ## H2 and ### H3 headings
- Actionable with practical tips and examples

**REQUIREMENTS:**
- Keep the same topic and main points
- Maintain proper markdown formatting (## H2, ### H3)
- Add blank lines between paragraphs and sections
- Include bullet lists with bold labels
- Add 💡 Key Takeaway and 🎯 Pro Tip callout boxes
- Expand FAQ section with 6-8 questions
- Ensure 2,000-2,500 words
- Keep all factual information accurate

Output ONLY the rewritten markdown content:`,
      });

      let rewrittenContent = response.text_response || response;
      rewrittenContent = rewrittenContent.replace(/^```markdown\n?/gm, '').replace(/\n?```$/gm, '').trim();
      
      const wordCount = rewrittenContent.split(/\s+/).filter(w => w.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);
      
      await base44.entities.BlogPost.update(post.id, {
        content: rewrittenContent,
        reading_time: readingTime
      });

      return { success: true, title: post.title };
    } catch (error) {
      console.error(`Rewrite error for "${post.title}":`, error);
      return { success: false, title: post.title, error: error.message };
    }
  };

  const handleRewriteAll = async () => {
    const posts = await base44.entities.BlogPost.list('-created_date', 200);
    
    if (posts.length === 0) {
      alert('No blog posts found. Please create some blog posts first!');
      return;
    }

    if (!window.confirm(`Rewrite ALL ${posts.length} blog posts to be more engaging and comprehensive? This takes about 10-12 seconds per post. Continue?`)) {
      return;
    }

    setIsProcessing(true);
    setError('');
    setResults([]);
    setProgress({ current: 0, total: posts.length });

    try {
      const rewriteResults = [];
      for (let i = 0; i < posts.length; i++) {
        const result = await rewritePost(posts[i]);
        rewriteResults.push(result);
        setProgress({ current: i + 1, total: posts.length });
        setResults([...rewriteResults]);
        
        if (i < posts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

    } catch (error) {
      console.error('Bulk rewrite error:', error);
      setError('Failed to rewrite posts: ' + error.message);
    } finally {
      setIsProcessing(false);
      setPostsCount(0);
      checkPosts();
    }
  };

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  // Empty state - no blog posts
  if (postsCount === 0 && !isProcessing) {
    return (
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Wand2 className="w-7 h-7 text-green-600" />
            AI Blog Rewriter
          </CardTitle>
          <CardDescription className="text-base">
            Rewrite existing posts to be more engaging, comprehensive, and SEO-optimized.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800 font-bold">No blog posts found.</AlertTitle>
            <AlertDescription className="text-red-700">
              You need to create blog posts first before you can rewrite them.
            </AlertDescription>
          </Alert>

          <div className="text-center py-8">
            <FileEdit className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Create Your First Blog Post</h3>
            <p className="text-slate-600 mb-6">
              Use our AI blog generators in the Content tab to create blog posts, then come back here to rewrite them.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={createPageUrl('Admin')}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Go to Content Tab
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">💡 How to Get Started:</h4>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Click the "Content" tab at the top</li>
              <li>Use "Complete Blog Generator" or "SEO Intelligence Blog Generator"</li>
              <li>Generate 1 or more blog posts</li>
              <li>Come back to this "Rewrite" tool to enhance them</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="w-7 h-7 text-green-600" />
          AI Blog Rewriter
        </CardTitle>
        <CardDescription className="text-base">
          Rewrite existing posts to be more engaging, comprehensive, and SEO-optimized.
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
              <span>Rewriting posts with AI...</span>
              <span className="text-green-600">{progress.current} of {progress.total}</span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-3" />
            <p className="text-xs text-slate-500 text-center">
              Rewriting each post to be more engaging. Please don't close this tab.
              <br />
              Estimated time remaining: {Math.ceil((progress.total - progress.current) * 10 / 60)} minutes
            </p>
          </div>
        )}

        {results.length > 0 && !isProcessing && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800 text-lg font-bold">Rewrite Complete!</AlertTitle>
            <AlertDescription className="text-green-700 text-base">
              Successfully rewrote <strong>{successCount}</strong> post{successCount !== 1 ? 's' : ''}.
              {failureCount > 0 && ` ${failureCount} failed (check console).`}
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto border-2 border-slate-200 rounded-lg p-4 space-y-2 bg-slate-50">
            <h3 className="font-semibold text-slate-700 mb-3 sticky top-0 bg-slate-50 pb-2">
              Rewritten Posts ({results.length}):
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

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">What This Tool Does:</h4>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li>Rewrites posts to be more engaging and conversational</li>
            <li>Expands content with deeper insights and examples</li>
            <li>Improves SEO with natural keyword integration</li>
            <li>Maintains proper markdown structure (## and ###)</li>
            <li>Adds more actionable tips and practical advice</li>
            <li>Expands FAQ sections</li>
            <li>Keeps all factual information accurate</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important:</h4>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>This will rewrite ALL blog posts ({postsCount} found)</li>
            <li>Content will be expanded and enhanced</li>
            <li>Factual accuracy is preserved</li>
            <li>Takes 10-12 seconds per post</li>
          </ul>
        </div>

        <Button
          onClick={handleRewriteAll}
          disabled={isProcessing || postsCount === 0}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-6 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Rewriting... ({progress.current}/{progress.total})
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6 mr-2" />
              Rewrite All {postsCount} Blog Posts
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}