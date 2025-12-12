import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { base44 } from "@/api/base44Client";
import { CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";

/**
 * Code Validation Agent
 * Automatically checks common issues across the codebase
 */
export default function CodeValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState([]);

  const validateCodebase = async () => {
    setIsValidating(true);
    const issues = [];

    try {
      // 1. Check all blog posts have featured images
      const posts = await base44.entities.BlogPost.list("-created_date", 200);
      const postsWithoutImages = posts.filter(p => !p.featured_image);
      
      if (postsWithoutImages.length > 0) {
        issues.push({
          type: 'error',
          category: 'Content',
          message: `${postsWithoutImages.length} blog posts missing featured images`,
          fix: 'Run "Generate Missing Images" from Site Health Check',
          items: postsWithoutImages.map(p => p.title)
        });
      }

      // 2. Check for duplicate images
      const imageMap = new Map();
      posts.forEach(post => {
        if (post.featured_image) {
          if (!imageMap.has(post.featured_image)) {
            imageMap.set(post.featured_image, []);
          }
          imageMap.get(post.featured_image).push(post);
        }
      });

      const duplicates = Array.from(imageMap.entries()).filter(([, posts]) => posts.length > 1);
      if (duplicates.length > 0) {
        issues.push({
          type: 'warning',
          category: 'Images',
          message: `${duplicates.length} duplicate images found across ${duplicates.reduce((sum, [, posts]) => sum + posts.length, 0)} posts`,
          fix: 'Run "Regenerate All" from Site Health Check',
          items: duplicates.slice(0, 3).map(([url, posts]) => 
            `${posts.length} posts share: ${url.substring(0, 50)}...`
          )
        });
      }

      // 3. Check listings without descriptions
      const listings = await base44.entities.DirectoryListing.list("-created_date", 500);
      const listingsWithoutDesc = listings.filter(l => !l.description || l.description.length < 50);
      
      if (listingsWithoutDesc.length > 0) {
        issues.push({
          type: 'warning',
          category: 'Listings',
          message: `${listingsWithoutDesc.length} listings have missing or short descriptions`,
          fix: 'Edit listings to add detailed descriptions',
          items: listingsWithoutDesc.slice(0, 5).map(l => l.name)
        });
      }

      // 4. Check for invalid URLs
      const invalidUrls = listings.filter(l => {
        if (!l.website) return true;
        try {
          new URL(l.website);
          return false;
        } catch {
          return true;
        }
      });

      if (invalidUrls.length > 0) {
        issues.push({
          type: 'error',
          category: 'URLs',
          message: `${invalidUrls.length} listings have invalid website URLs`,
          fix: 'Update or remove invalid URLs',
          items: invalidUrls.slice(0, 5).map(l => `${l.name}: ${l.website || 'missing'}`)
        });
      }

      // 5. Check blog formatting
      const poorlyFormatted = posts.filter(p => {
        if (!p.content) return false;
        const hasProperHeaders = /^##\s+/m.test(p.content) || /^###\s+/m.test(p.content);
        const hasProperSpacing = /\n\n##\s+/m.test(p.content) || /\n\n###\s+/m.test(p.content);
        return !hasProperHeaders || !hasProperSpacing;
      });

      if (poorlyFormatted.length > 0) {
        issues.push({
          type: 'warning',
          category: 'Formatting',
          message: `${poorlyFormatted.length} blog posts have poor formatting`,
          fix: 'Run "Fix All Now" from Site Health Check',
          items: poorlyFormatted.slice(0, 5).map(p => p.title)
        });
      }

      // 6. Check for unpublished posts (potential drafts)
      const unpublished = posts.filter(p => !p.published);
      if (unpublished.length > 0) {
        issues.push({
          type: 'info',
          category: 'Content',
          message: `${unpublished.length} blog posts are unpublished`,
          fix: 'Review and publish or delete drafts',
          items: unpublished.slice(0, 5).map(p => p.title)
        });
      }

      // 7. Success message if no issues
      if (issues.length === 0) {
        issues.push({
          type: 'success',
          category: 'System',
          message: '✅ All checks passed! No issues found.',
          fix: null,
          items: []
        });
      }

      setResults(issues);
    } catch (error) {
      issues.push({
        type: 'error',
        category: 'System',
        message: `Validation failed: ${error.message}`,
        fix: 'Check console for details',
        items: []
      });
      setResults(issues);
    } finally {
      setIsValidating(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertVariant = (type) => {
    return type === 'error' ? 'destructive' : 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🤖 Automated Code Validation Agent</span>
          <Button
            onClick={validateCodebase}
            disabled={isValidating}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {isValidating ? (
              <>
                <Play className="w-4 h-4 mr-2 animate-pulse" />
                Validating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Full Validation
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.length === 0 && !isValidating && (
            <p className="text-slate-600 text-center py-8">
              Click "Run Full Validation" to check for common issues
            </p>
          )}

          {results.map((result, index) => (
            <Alert key={index} variant={getAlertVariant(result.type)}>
              <div className="flex items-start gap-3">
                {getIcon(result.type)}
                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    [{result.category}] {result.message}
                  </div>
                  
                  {result.fix && (
                    <div className="text-sm text-slate-600 mb-2">
                      💡 <strong>Fix:</strong> {result.fix}
                    </div>
                  )}

                  {result.items && result.items.length > 0 && (
                    <div className="mt-2 text-sm">
                      <strong>Examples:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {result.items.slice(0, 3).map((item, i) => (
                          <li key={i} className="text-slate-600">{item}</li>
                        ))}
                      </ul>
                      {result.items.length > 3 && (
                        <p className="text-slate-500 mt-1">
                          ...and {result.items.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">What This Agent Checks:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Blog posts missing featured images</li>
            <li>Duplicate images across posts</li>
            <li>Listings with missing or short descriptions</li>
            <li>Invalid website URLs</li>
            <li>Poor blog post formatting</li>
            <li>Unpublished draft content</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}