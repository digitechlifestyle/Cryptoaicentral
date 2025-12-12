import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BulkImageRegeneration() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const regenerateImage = async (post) => {
    try {
      const uniqueTimestamp = Date.now();
      const randomSeed = Math.random().toString(36).substring(7);

      const imagePrompt = `Professional editorial illustration for: "${post.title}"

UNIQUE IDENTIFIERS:
- Timestamp: ${uniqueTimestamp}
- Seed: ${randomSeed}
- Topic: ${post.title}

STYLE: Modern, abstract, professional financial technology publication
COLORS: Electric blue, indigo, purple, with subtle gold accents, gradient
COMPOSITION: 16:9 landscape, high quality, dynamic flow
REQUIREMENTS: NO text, NO generic crypto coins, Bitcoin logos, or Ethereum symbols, NO human figures, NO specific company logos.
FOCUS: Abstract visualization of the concepts in "${post.title}".

Create a completely unique, sophisticated image that represents this specific article topic without being literal.`;

      const imageResponse = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      if (!imageResponse || !imageResponse.url) {
        throw new Error('Image generation failed');
      }

      await base44.entities.BlogPost.update(post.id, {
        featured_image: imageResponse.url
      });

      return { success: true, title: post.title };
    } catch (error) {
      console.error(`Failed to regenerate image for "${post.title}":`, error);
      return { success: false, title: post.title, error: error.message };
    }
  };

  const handleRegenerateAll = async () => {
    if (!window.confirm('Regenerate featured images for ALL blog posts? This takes about 4-5 seconds per post. Continue?')) {
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

      const regenerateResults = [];
      for (let i = 0; i < posts.length; i++) {
        const result = await regenerateImage(posts[i]);
        regenerateResults.push(result);
        setProgress({ current: i + 1, total: posts.length });
        setResults([...regenerateResults]);
        
        // Delay to avoid rate limiting
        if (i < posts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }

    } catch (error) {
      console.error('Bulk regeneration error:', error);
      setError('Failed to regenerate images: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ImageIcon className="w-7 h-7 text-blue-600" />
          Bulk Image Regeneration
        </CardTitle>
        <CardDescription className="text-base">
          Regenerate unique featured images for all blog posts using AI.
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
              <span>Generating images...</span>
              <span className="text-blue-600">{progress.current} of {progress.total}</span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-3" />
            <p className="text-xs text-slate-500 text-center">
              Generating unique images for each post. Please don't close this tab.
              <br />
              Estimated time remaining: {Math.ceil((progress.total - progress.current) * 4 / 60)} minutes
            </p>
          </div>
        )}

        {results.length > 0 && !isProcessing && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800 text-lg font-bold">Regeneration Complete!</AlertTitle>
            <AlertDescription className="text-green-700 text-base">
              Successfully regenerated <strong>{successCount}</strong> image{successCount !== 1 ? 's' : ''}.
              {failureCount > 0 && ` ${failureCount} failed (check console).`}
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto border-2 border-slate-200 rounded-lg p-4 space-y-2 bg-slate-50">
            <h3 className="font-semibold text-slate-700 mb-3 sticky top-0 bg-slate-50 pb-2">
              Processed Posts ({results.length}):
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

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">What This Tool Does:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Generates completely unique AI images for each blog post</li>
            <li>Uses post title to create relevant, abstract visuals</li>
            <li>Professional 16:9 editorial style images</li>
            <li>No generic crypto symbols or logos</li>
            <li>Each image has unique timestamp and seed for variety</li>
          </ul>
        </div>

        <Button
          onClick={handleRegenerateAll}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Generating... ({progress.current}/{progress.total})
            </>
          ) : (
            <>
              <RefreshCw className="w-6 h-6 mr-2" />
              Regenerate All Featured Images
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}