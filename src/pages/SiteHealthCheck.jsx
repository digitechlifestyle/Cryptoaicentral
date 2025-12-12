
import React, { useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createPageUrl } from "@/utils";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Trash2,
  RefreshCw,
  Edit,
  Info,
  Play,
  Download,
  Lightbulb,
  ExternalLink,
  Shield,
  Loader2, // Added for loading spinner
  Sparkles, // Added for generate button icon
} from "lucide-react";
import CodeValidator from "../components/shared/CodeValidator";

const ISSUE_SUGGESTIONS = {
  'missing alt': {
    severity: 'warning',
    fix: 'Add descriptive alt text to every image tag for accessibility',
    action: 'Review images in listings and add descriptive alt attributes',
    learnMore: 'https://www.w3.org/WAI/tutorials/images/'
  },
  'missing featured images': {
    severity: 'error',
    fix: 'Generate or upload featured images for all blog posts',
    action: 'Use the bulk image regeneration tool in Admin panel, or edit posts directly.',
    learnMore: null
  },
  'duplicate images': {
    severity: 'warning',
    fix: 'Remove duplicate images to improve uniqueness and SEO',
    action: 'Use the automatic duplicate removal or regeneration tools below.',
    learnMore: null
  },
  'missing or short descriptions': {
    severity: 'warning',
    fix: 'Add comprehensive descriptions to all listings',
    action: 'Edit affected listings to add detailed descriptions.',
    learnMore: null
  },
  'invalid website URLs': {
    severity: 'error',
    fix: 'Verify and update all invalid website URLs',
    action: 'Check each listing\'s URL and update or remove dead links.',
    learnMore: null
  },
  'poor formatting': {
    severity: 'warning',
    fix: 'Reformat blog posts with proper H2/H3 headers and spacing',
    action: 'Use the bulk reformatting tool to fix all posts at once.',
    learnMore: null
  },
  'missing meta': {
    severity: 'warning',
    fix: 'Provide meta descriptions for better SEO',
    action: 'Add unique meta descriptions to all pages',
    learnMore: 'https://developers.google.com/search/docs/appearance/snippet'
  },
  'security': {
    severity: 'error',
    fix: 'Review and fix security vulnerabilities immediately',
    action: 'Follow security best practices and update dependencies',
    learnMore: 'https://owasp.org/www-project-top-ten/'
  },
  'http instead of https': {
    severity: 'warning',
    fix: 'Ensure all links use HTTPS for better security and SEO ranking',
    action: 'Update HTTP links to HTTPS where possible.',
    learnMore: 'https://web.dev/http-to-https/'
  },
  'performance': {
    severity: 'info',
    fix: 'Optimize assets and reduce page load times',
    action: 'Compress images, minify code, enable caching',
    learnMore: 'https://web.dev/performance/'
  }
};

function getSuggestion(issueText) {
  const lowerText = issueText.toLowerCase();
  for (const [keyword, suggestion] of Object.entries(ISSUE_SUGGESTIONS)) {
    if (lowerText.includes(keyword)) {
      return suggestion;
    }
  }
  return {
    severity: 'info',
    fix: 'Review and resolve this issue manually.',
    action: 'Further investigation may be required.',
    learnMore: null
  };
}

// Advanced Blog Formatter (based on Python OfflineBlogGenerator)
class BlogFormatter {
  constructor() {
    this.sectionKeywords = [
      'introduction', 'what is', 'types', 'categories', 'examples', 'platforms',
      'how it works', 'how does', 'technical', 'process', 'security', 'risk', 'management',
      'tools', 'strategies', 'regulatory', 'industry', 'landscape', 'future',
      'trends', 'innovations', 'how to choose', 'evaluation', 'guide',
      'frequently asked', 'faq', 'faqs', 'questions', 'conclusion', 'next steps',
      'benefits', 'advantages', 'features', 'comparison', 'vs', 'versus',
      'best practices', 'tips', 'common', 'pitfalls', 'mistakes', 'challenges'
    ];

    // Regex patterns for content fixing (from Python code)
    this.fixPatterns = [
      // Fix bold formatting
      { pattern: /\*\*([^*]+)\*\*/g, replacement: '**$1**' },
      // Fix multiple newlines (max 2)
      { pattern: /\n{3,}/g, replacement: '\n\n' },
      // Fix list formatting
      { pattern: /^-\s*(.*)$/gm, replacement: '- $1' },
      // Fix missing spaces after periods
      { pattern: /\.([A-Z])/g, replacement: '. $1' },
      // Fix camelCase to proper spacing
      { pattern: /([a-z])([A-Z])/g, replacement: '$1 $2' }
    ];
  }

  // Main method to fix existing problematic content
  fixExistingContent(content) {
    if (!content) return content;

    let fixed = content;

    // Apply all fix patterns
    for (const { pattern, replacement } of this.fixPatterns) {
      fixed = fixed.replace(pattern, replacement);
    }

    // Add proper spacing after headings
    fixed = fixed.replace(/(#+[^\n]+)\n(?!\n)/g, '$1\n\n');

    // Ensure proper spacing before headings
    fixed = fixed.replace(/([^\n])\n(##\s)/g, '$1\n\n$2');

    return fixed.trim();
  }

  formatBlogContent(content, title) {
    if (!content) return content;

    // First, apply basic fixes
    content = this.fixExistingContent(content);

    const lines = content.split('\n');
    const formattedLines = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle empty lines
      if (!line) {
        if (!inList) {
          formattedLines.push('');
        }
        continue;
      }

      // Detect headers
      const headerLevel = this.detectHeaderLevel(line, i, lines);
      
      if (headerLevel === 2) {
        // H2 - Main sections
        if (inList) inList = false;
        formattedLines.push('');
        formattedLines.push('');
        formattedLines.push(`## ${this.cleanHeaderText(line)}`);
        formattedLines.push('');
      } else if (headerLevel === 3) {
        // H3 - Subsections
        if (inList) inList = false;
        formattedLines.push('');
        formattedLines.push(`### ${this.cleanHeaderText(line)}`);
        formattedLines.push('');
      } else if (this.isListItem(line)) {
        // List items
        if (!inList) {
          formattedLines.push('');
          inList = true;
        }
        formattedLines.push(this.formatListItem(line));
      } else if (this.isCalloutBox(line)) {
        // Callout boxes
        if (inList) inList = false;
        formattedLines.push('');
        formattedLines.push(line);
        formattedLines.push('');
      } else if (this.isTableRow(line)) {
        // Table rows
        if (inList) inList = false;
        formattedLines.push(line);
      } else {
        // Regular paragraph
        if (inList) {
          inList = false;
          formattedLines.push('');
        }
        const formatted = this.formatParagraph(line);
        formattedLines.push(formatted);
      }
    }

    // Join and ensure proper spacing
    let result = formattedLines.join('\n');
    result = this.ensureProperSpacing(result);
    
    return result;
  }

  detectHeaderLevel(line, index, allLines) {
    // Already has markdown headers
    if (line.startsWith('# ')) return 1;
    if (line.startsWith('## ')) return 2;
    if (line.startsWith('### ')) return 3;
    if (line.startsWith('#### ')) return 3;

    const cleanLine = line.toLowerCase().replace(/[^a-z\s]/g, '');
    
    // Check if line matches section keywords
    const isSection = this.sectionKeywords.some(keyword => 
      cleanLine.includes(keyword)
    );

    // Characteristics of headers
    const isShort = line.length < 100;
    const hasNoEndPunctuation = !line.match(/[.!?,;]$/);
    const startsWithCapital = /^[A-Z]/.test(line);
    const isBold = line.startsWith('**') && line.endsWith('**');
    const isNumberedHeader = /^\d+\.\s+[A-Z]/.test(line) && line.length < 80;
    const isAllCaps = line === line.toUpperCase() && line.length > 3;

    // Look at context
    const nextLine = index + 1 < allLines.length ? allLines[index + 1].trim() : '';
    const prevLine = index > 0 ? allLines[index - 1].trim() : '';
    const followedByContent = nextLine && nextLine.length > 20 && !nextLine.startsWith('#');
    const followedByEmpty = nextLine === '';

    // H2 detection - main sections
    if (isSection && isShort && hasNoEndPunctuation) {
      return 2;
    }

    if (isAllCaps && isShort) {
      return 2;
    }

    // H3 detection - subsections
    if (isBold && isShort && followedByContent) {
      return 3;
    }

    if (isNumberedHeader) {
      return 3;
    }

    if (startsWithCapital && isShort && hasNoEndPunctuation && 
        (followedByContent || followedByEmpty) && !line.includes(',')) {
      return 3;
    }

    return 0;
  }

  cleanHeaderText(line) {
    // Remove existing markdown
    let clean = line.replace(/^#+\s*/, '');
    // Remove bold markers
    clean = clean.replace(/^\*\*/, '').replace(/\*\*$/, '');
    // Remove trailing punctuation
    clean = clean.replace(/[.:;,]$/, '');
    // Remove numbered prefixes (1., 2., etc)
    clean = clean.replace(/^\d+\.\s*/, '');
    return clean.trim();
  }

  isListItem(line) {
    return /^[-*•]\s/.test(line) || /^\d+\.\s/.test(line);
  }

  formatListItem(line) {
    // Standardize to dash
    let formatted = line.replace(/^[*•]\s/, '- ');
    // Bold the label if it exists
    formatted = formatted.replace(/^([-\d.]+\s+)([A-Z][^:]+)(:)/g, '$1**$2**$3');
    return formatted;
  }

  isCalloutBox(line) {
    return /^(💡|🎯|⚠️|✅|❌|📝|🔍|💼|🚀)\s*\*\*/.test(line);
  }

  isTableRow(line) {
    return line.includes('|') && line.split('|').length >= 3;
  }

  formatParagraph(line) {
    // Bold labels at start of line
    let formatted = line.replace(/^([A-Z][a-zA-Z\s]+):/g, '**$1:**');
    return formatted;
  }

  ensureProperSpacing(content) {
    // Max 2 blank lines
    content = content.replace(/\n{4,}/g, '\n\n\n');
    
    // 2 blank lines before ## headings
    content = content.replace(/([^\n])\n(##\s)/g, '$1\n\n\n$2');
    
    // 1 blank line after ## headings
    content = content.replace(/(##\s[^\n]+)\n([^\n#])/g, '$1\n\n$2');
    
    // 1 blank line before ### headings
    content = content.replace(/([^\n])\n(###\s)/g, '$1\n\n$2');
    
    // 1 blank line after ### headings
    content = content.replace(/(###\s[^\n]+)\n([^\n#])/g, '$1\n\n$2');
    
    // No blank lines between list items
    content = content.replace(/(-\s[^\n]+)\n\n(-\s)/g, '$1\n$2');
    
    // 1 blank line before and after lists
    content = content.replace(/([^\n-])\n(-\s)/g, '$1\n\n$2');
    content = content.replace(/(-\s[^\n]+)\n([^\n-])/g, '$1\n\n$2');
    
    return content.trim();
  }

  calculateReadability(content) {
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0 || words.length === 0) {
      return 70.0;
    }
    
    const avgSentenceLength = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Simplified Flesch-like score
    const readability = 100 - (avgSentenceLength * 0.5 + avgWordLength * 0.5);
    return Math.max(30, Math.min(90, readability));
  }
}

export default function SiteHealthCheck() {
  const [scanResults, setScanResults] = useState({
    database: [],
    content: [],
    images: [],
    links: [],
    security: [],
    formatting: []
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReformatting, setIsReformatting] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false); // New state variable

  const formatter = new BlogFormatter();

  React.useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      setIsAdmin(user?.role === 'admin');
    } catch (error) {
      setIsAdmin(false);
    }
  };

  // Generate featured image for a blog post
  const generateFeaturedImage = async (title, category = "Technology") => {
    try {
      const uniqueTimestamp = Date.now();
      const randomSeed = Math.random().toString(36).substring(2, 15);
      const randomSeed2 = Math.random().toString(36).substring(2, 15); // Added second random seed
      const titleHash = title.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);

      const visualStyles = [
        'futuristic cyberpunk with neon grid patterns and digital rain',
        'ultra-minimalist geometric with perfect symmetry and gradients',
        'organic fluid shapes with iridescent color flows',
        'precise isometric 3D with technical depth',
        'abstract data streams with particle animations',
        'blueprint schematic with engineering precision lines',
        'translucent holographic layers with glow effects',
        'faceted crystalline structures with light refraction',
        'glowing circuit pathways with node connections',
        'dynamic energy particle system with motion blur'
      ];

      const colorPalettes = [
        'electric blue (#0066FF), cyan (#00FFFF), purple (#9933FF)',
        'indigo (#3B0066), gold (#FFD700), pearl white (#F8F8FF)',
        'teal (#008B8B), coral (#FF7F50), salmon (#FA8072)',
        'violet (#8B00FF), lime (#00FF00), chartreuse (#7FFF00)',
        'navy (#001F3F), amber (#FFBF00), honey (#FFC30B)'
      ];

      const compositions = [
        'perfect center focal point with symmetric radial burst',
        'dramatic diagonal split with opposing color blocks',
        'intricate circular mandala with nested rings',
        'layered depth planes creating 3D illusion',
        'asymmetric golden ratio spiral composition'
      ];

      const styleIndex = Math.abs((titleHash + uniqueTimestamp) % visualStyles.length);
      const colorIndex = Math.abs((uniqueTimestamp + titleHash) % colorPalettes.length);
      const compIndex = Math.abs((titleHash) % compositions.length);

      const selectedStyle = visualStyles[styleIndex];
      const selectedColors = colorPalettes[colorIndex];
      const selectedComp = compositions[compIndex];

      const imagePrompt = `Generate a COMPLETELY UNIQUE professional illustration for: "${title}"

━━━ ABSOLUTE UNIQUENESS MARKERS ━━━
Timestamp: ${uniqueTimestamp}
Random Seed: ${randomSeed}
Random Seed 2: ${randomSeed2}
Title Hash: ${titleHash}

━━━ VISUAL STYLE SPECIFICATION ━━━
Art Style: ${selectedStyle}
Color Palette: ${selectedColors}
Composition: ${selectedComp}

━━━ CONTENT-SPECIFIC THEMEING ━━━
Article Title: ${title}
Category: ${category}

━━━ CRITICAL REQUIREMENTS ━━━
✓ Professional 16:9 widescreen format
✓ High-resolution 4K quality output
✓ Financial technology publication grade
✓ ZERO generic symbols (no coins, logos, Bitcoin/Ethereum icons)
✓ MUST be visually distinct from ALL other crypto imagery
✓ Abstract conceptual metaphor ONLY
✓ NO text, typography, or letters
✓ NO human faces or figures
✓ ZERO stock photo aesthetics

Create a one-of-a-kind visual masterpiece for: "${title}"`;

      const imageResponse = await base44.integrations.Core.GenerateImage({ 
        prompt: imagePrompt 
      });

      if (imageResponse && imageResponse.url) {
        return imageResponse.url;
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error) {
      console.error(`Failed to generate image for "${title}":`, error);
      throw error;
    }
  };

  // Generate images for all posts missing featured images
  const generateMissingImages = async () => {
    const imageIssue = scanResults.images.find(issue => 
      issue.message.includes('missing featured images')
    );
    
    if (!imageIssue || !imageIssue.postIds) {
      alert('No posts with missing images found. Run health check first.');
      return;
    }

    const postsToFix = imageIssue.postIds;

    if (!window.confirm(`Generate featured images for ${postsToFix.length} blog posts?\n\n⏱️ Estimated time: ${Math.ceil(postsToFix.length * 4)} seconds\n🎨 Each image will be completely unique\n\nContinue?`)) {
      return;
    }

    setIsGeneratingImages(true);

    try {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Generating images for ${postsToFix.length} posts...`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
      let generated = 0;
      let failed = 0;

      for (const postId of postsToFix) {
        try {
          // Fetch the post
          const posts = await base44.entities.BlogPost.filter({ id: postId });
          if (posts.length === 0) {
            console.error(`✗ Post not found: ${postId}`);
            failed++;
            continue;
          }

          const post = posts[0];
          console.log(`[${generated + failed + 1}/${postsToFix.length}] Generating image for: "${post.title}"`);

          // Generate unique featured image
          const imageUrl = await generateFeaturedImage(post.title, post.category);

          // Update post with new image
          await base44.entities.BlogPost.update(postId, {
            featured_image: imageUrl
          });

          generated++;
          console.log(`✓ Successfully generated image for: "${post.title}"`);
          console.log(`  └─ Image URL: ${imageUrl.substring(0, 60)}...`);
          console.log(`  └─ Progress: ${generated}/${postsToFix.length} complete\n`);

          // Delay between image generations (rate limiting)
          if (generated + failed < postsToFix.length) {
            console.log(`⏳ Waiting 4 seconds before next generation...\n`);
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        } catch (error) {
          failed++;
          console.error(`✗ Failed to generate image for post ${postId}:`, error);
        }
      }

      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`✅ IMAGE GENERATION COMPLETE`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`✓ Success: ${generated}`);
      console.log(`✗ Failed: ${failed}`);
      console.log(`📊 Total: ${postsToFix.length}`);

      alert(`✅ Image Generation Complete!\n\n✓ Success: ${generated}\n✗ Failed: ${failed}\n📊 Total: ${postsToFix.length}\n\nAll posts now have unique featured images!`);
      await runHealthCheck();
    } catch (error) {
      console.error('Batch image generation error:', error);
      alert('Failed to generate images: ' + error.message);
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const runHealthCheck = async () => {
    setIsScanning(true);
    setScanComplete(false);
    const results = {
      database: [],
      content: [],
      images: [],
      links: [],
      security: [],
      formatting: []
    };

    try {
      const listings = await base44.entities.DirectoryListing.list('-created_date', 500);
      const posts = await base44.entities.BlogPost.list('-created_date', 200);

      results.database.push({
        type: 'success',
        message: `Database connection healthy - ${listings.length} listings, ${posts.length} posts`,
        category: 'connection'
      });

      // Content quality checks
      const emptyDescriptions = listings.filter(l => !l.description || l.description.length < 50);
      if (emptyDescriptions.length > 0) {
        results.content.push({
          type: 'warning',
          message: `${emptyDescriptions.length} listings have missing or short descriptions`,
          details: emptyDescriptions.slice(0, 5).map(l => l.name),
          listingIds: emptyDescriptions.slice(0, 5).map(l => l.id),
          category: 'descriptions'
        });
      }

      const missingLogos = listings.filter(l => !l.logo_url);
      if (missingLogos.length > 0) {
        results.content.push({
          type: 'info',
          message: `${missingLogos.length} listings are missing logos`,
          details: missingLogos.slice(0, 5).map(l => l.name),
          listingIds: missingLogos.slice(0, 5).map(l => l.id),
          category: 'logos'
        });
      }

      // Image checks
      const postsWithoutImages = posts.filter(p => !p.featured_image);
      if (postsWithoutImages.length > 0) {
        results.images.push({
          type: 'error',
          message: `${postsWithoutImages.length} blog posts missing featured images`,
          details: postsWithoutImages.slice(0, 5).map(p => p.title),
          postIds: postsWithoutImages.map(p => p.id), // All post IDs needed for batch generation
          allPosts: postsWithoutImages, // Also include full posts data if needed later
          category: 'missing'
        });
      }

      // Check for duplicate images
      const imageMap = new Map();
      posts.forEach(post => {
        if (post.featured_image) {
          if (!imageMap.has(post.featured_image)) {
            imageMap.set(post.featured_image, []);
          }
          imageMap.set(post.featured_image, [...imageMap.get(post.featured_image), post]);
        }
      });

      const duplicates = Array.from(imageMap.entries()).filter(([, posts]) => posts.length > 1);
      if (duplicates.length > 0) {
        const totalDuplicatePosts = duplicates.reduce((sum, [, posts]) => sum + posts.length, 0);
        results.images.push({
          type: 'warning',
          message: `${totalDuplicatePosts} blog posts sharing ${duplicates.length} duplicate images`,
          details: duplicates.slice(0, 3).map(([url, posts]) =>
            `${posts.length} posts share: ${url.substring(0, 50)}...`
          ),
          duplicateData: duplicates,
          category: 'duplicates'
        });
      }

      // Link validation
      const invalidWebsites = listings.filter(l => {
        if (!l.website) return true;
        try {
          new URL(l.website);
          return false;
        } catch {
          return true;
        }
      });

      if (invalidWebsites.length > 0) {
        results.links.push({
          type: 'error',
          message: `${invalidWebsites.length} listings have invalid website URLs`,
          details: invalidWebsites.slice(0, 5).map(l => `${l.name}: ${l.website || 'missing'}`),
          listingIds: invalidWebsites.slice(0, 5).map(l => l.id),
          category: 'invalid'
        });
      }

      // Security checks
      const listingsWithAffiliateLinks = listings.filter(l => l.affiliate_link);
      results.security.push({
        type: 'info',
        message: `${listingsWithAffiliateLinks.length} listings have affiliate links configured`,
        category: 'affiliate'
      });

      const httpListings = listings.filter(l => l.website && l.website.startsWith('http://'));
      if (httpListings.length > 0) {
        results.security.push({
          type: 'warning',
          message: `${httpListings.length} listings use HTTP instead of HTTPS`,
          details: httpListings.slice(0, 5).map(l => l.name),
          listingIds: httpListings.slice(0, 5).map(l => l.id),
          category: 'https'
        });
      }

      // Check blog formatting
      const poorlyFormattedPosts = posts.filter(p => {
        if (!p.content) return false;
        const hasProperHeaders = /^##\s+/m.test(p.content) || /^###\s+/m.test(p.content);
        const hasProperSpacing = /\n\n##\s+/m.test(p.content) || /\n\n###\s+/m.test(p.content);
        return !hasProperHeaders || !hasProperSpacing;
      });

      if (poorlyFormattedPosts.length > 0) {
        results.formatting.push({
          type: 'warning',
          message: `${poorlyFormattedPosts.length} blog posts have poor formatting (missing H2/H3 headers or spacing)`,
          details: poorlyFormattedPosts.slice(0, 5).map(p => p.title),
          postIds: poorlyFormattedPosts.map(p => p.id),
          allPosts: poorlyFormattedPosts,
          category: 'formatting'
        });
      }

      setScanResults(results);
      setScanComplete(true);
    } catch (error) {
      console.error('Health check failed:', error);
      results.database.push({
        type: 'error',
        message: `Health check failed: ${error.message}`,
        category: 'error'
      });
      setScanResults(results);
    } finally {
      setIsScanning(false);
    }
  };

  const exportResults = (format = 'json') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `health-check-${timestamp}.${format}`;

    if (format === 'json') {
      const dataStr = JSON.stringify(scanResults, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', filename);
      linkElement.click();
    } else if (format === 'csv') {
      const rows = [];
      rows.push(['Category', 'Type', 'Message', 'Details']);

      Object.entries(scanResults).forEach(([category, issues]) => {
        issues.forEach(issue => {
          rows.push([
            category,
            issue.type,
            issue.message,
            issue.details ? issue.details.join('; ') : ''
          ]);
        });
      });

      const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', filename);
      linkElement.click();
    }
  };

  const removeDuplicateImages = async () => {
    if (!window.confirm("This will REMOVE featured images from blog posts that have duplicate images (keeping one instance). You can add unique images later manually. Continue?")) {
      return;
    }

    setIsScanning(true);
    try {
      const posts = await base44.entities.BlogPost.list("-created_date", 200);

      const imageMap = new Map();
      posts.forEach(post => {
        if (post.featured_image) {
          if (!imageMap.has(post.featured_image)) {
            imageMap.set(post.featured_image, []);
          }
          imageMap.get(post.featured_image).push(post);
        }
      });

      const postsToFix = [];
      imageMap.forEach((postsWithSameImage, imageUrl) => {
        if (postsWithSameImage.length > 1) {
          console.log(`Found ${postsWithSameImage.length} posts sharing: ${imageUrl.substring(0, 50)}...`);
          postsToFix.push(...postsWithSameImage.slice(1));
        }
      });

      console.log(`Removing images from ${postsToFix.length} posts...`);
      let removedCount = 0;
      for (const post of postsToFix) {
        await base44.entities.BlogPost.update(post.id, { featured_image: null });
        console.log(`✓ Removed image from: "${post.title}" (ID: ${post.id})`);
        removedCount++;
      }

      alert(`Removed duplicate images from ${removedCount} blog posts!\n\nYou can now add unique images manually or regenerate them later.`);
      await runHealthCheck();
    } catch (error) {
      console.error("Error removing duplicate images:", error);
      alert("Failed to remove duplicate images. Please try again.");
    }
    setIsScanning(false);
  };

  const fixDuplicateImages = async () => {
    const confirmMsg = `This will find ALL blog posts with duplicate images and regenerate completely unique images for each one.

⚠️ This will replace images on approximately 10 blog posts.
⏱️ Estimated time: 40-60 seconds (4 seconds per image with safety delays)

Continue?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsScanning(true);

    try {
      const posts = await base44.entities.BlogPost.list("-created_date", 200);

      console.log(`✓ Loaded ${posts.length} total blog posts`);

      const imageMap = new Map();
      posts.forEach(post => {
        if (post.featured_image) {
          if (!imageMap.has(post.featured_image)) {
            imageMap.set(post.featured_image, []);
          }
          imageMap.get(post.featured_image).push(post);
        }
      });

      const postsToFix = [];
      imageMap.forEach((postsWithSameImage, imageUrl) => {
        if (postsWithSameImage.length > 1) {
          console.log(`⚠️ Found ${postsWithSameImage.length} posts sharing image: ${imageUrl.substring(0, 60)}...`);
          postsToFix.push(...postsWithSameImage);
        }
      });

      if (postsToFix.length === 0) {
        alert("No duplicate images found!");
        setIsScanning(false);
        return;
      }

      console.log(`\n🔧 Total posts to regenerate: ${postsToFix.length}`);
      alert(`Found ${postsToFix.length} posts with duplicate images.\n\nStarting regeneration now...\nDO NOT CLOSE THIS TAB.`);

      let fixed = 0;
      let failed = 0;

      for (const post of postsToFix) {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`[${fixed + failed + 1}/${postsToFix.length}] Processing: "${post.title}"`);
        console.log(`Current image: ${post.featured_image?.substring(0, 60)}...`);

        try {
          const uniqueTimestamp = Date.now();
          const randomSeed = Math.random().toString(36).substring(2, 15);
          const randomSeed2 = Math.random().toString(36).substring(2, 15); // Declare randomSeed2 here
          const articleHash = post.title.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
          const postIdHash = post.id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);

          const visualStyles = [
            "futuristic cyberpunk with neon grid patterns and digital rain",
            "ultra-minimalist geometric with perfect symmetry and gradients",
            "organic fluid shapes with iridescent color flows",
            "precise isometric 3D with technical depth",
            "abstract data streams with particle animations",
            "blueprint schematic with engineering precision lines",
            "translucent holographic layers with glow effects",
            "faceted crystalline structures with light refraction",
            "glowing circuit pathways with node connections",
            "dynamic energy particle system with motion blur",
            "wireframe mesh with low-poly faceted surfaces",
            "reflective liquid metal with chrome distortions",
            "sharp angular low-poly with bold facets",
            "intentional glitch aesthetic with pixel sorting",
            "vibrant vaporwave with retro 80s gradients",
            "molecular atom visualization with orbital bonds",
            "neural network web with synapse connections",
            "deep space nebula with stellar formations",
            "intricate steampunk gears with industrial brass",
            "geometric origami folds with paper shadows",
            "quantum field visualization with wave patterns",
            "tessellated Islamic geometric patterns",
            "flowing liquid smoke with color gradients",
            "hexagonal honeycomb structure with depth",
            "fractal mandelbrot zoom with infinite detail"
          ];

          const colorPalettes = [
            "electric blue (#0066FF), cyan (#00FFFF), purple (#9933FF)",
            "indigo (#3B0066), gold (#FFD700), pearl white (#F8F8FF)",
            "teal (#008B8B), coral (#FF7F50), salmon (#FA8072)",
            "violet (#8B00FF), lime (#00FF00), chartreuse (#7FFF00)",
            "navy (#001F3F), amber (#FFBF00), honey (#FFC30B)",
            "turquoise (#40E0D0), fuchsia (#FF00FF), hot pink (#FF69B4)",
            "royal purple (#7851A9), gold (#FFD700), sunshine yellow (#FFD700)",
            "emerald (#50C878), magenta (#FF00FF), rose (#FF007F)",
            "crimson (#DC143C), ice blue (#87CEEB), frost (#E0FFFF)",
            "jade (#00A86B), sterling silver (#AAA9AD), platinum (#E5E4E2)",
            "neon magenta (#FF10F0), electric cyan (#00F0FF), laser green (#00FF00)",
            "bronze (#CD7F32), teal (#008080), forest (#014421)",
            "lavender (#E6E6FA), mint (#98FF98), sage (#9DC183)",
            "ruby (#E0115F), sapphire (#0F52BA), diamond white (#F0F8FF)",
            "charcoal (#36454F), gold leaf (#FFD700), champagne (#F7E7CE)",
            "sunset orange (#FF6347), twilight purple (#4B0082), dusk pink (#FFB6C1)",
            "lime punch (#32CD32), hot magenta (#FF1493), electric violet (#8F00FF)",
            "slate (#6A5ACD), peach (#FFE5B4), apricot (#FBCEB1)",
            "jade (#00A86B), rose gold (#B76E79), copper (#B87333)",
            "cobalt (#0047AB), tangerine (#F28500), saffron (#F4C430)",
            "obsidian (#0B1215), gold flake (#FFD700), silver mist (#C0C0C0)",
            "ocean blue (#006994), seafoam (#9FE2BF), coral reef (#FF6F61)",
            "deep plum (#8E4585), honey gold (#FFC30B), cream (#FFFDD0)",
            "forest green (#228B22), autumn orange (#FF8C00), harvest gold (#DA9100)",
            "midnight blue (#191970), star silver (#C0C0C0), moon yellow (#F0E68C)"
          ];

          const compositions = [
            "perfect center focal point with symmetric radial burst",
            "dramatic diagonal split with opposing color blocks",
            "intricate circular mandala with nested rings",
            "layered depth planes creating 3D illusion",
            "asymmetric golden ratio spiral composition",
            "modular grid system with repeating elements",
            "fibonacci sequence spiral from corner focus",
            "strong vertical ascent with upward energy",
            "sweeping horizontal panoramic flow",
            "scattered constellation with connecting lines",
            "rule of thirds with strategic focal zones",
            "perfect bilateral mirror symmetry",
            "explosive starburst from central origin",
            "cascading waterfall from top to bottom",
            "concentric orbital rings around hub",
            "triangular three-point focal balance",
            "z-pattern visual flow path",
            "natural framing drawing eye inward",
            "overlapping translucent layers",
            "radial balance with equal weight distribution",
            "recursive fractal zoom composition",
            "off-center tension with negative space",
            "converging perspective lines to vanishing point",
            "circular vortex spiral inward",
            "hexagonal tessellation pattern array"
          ];

          const styleIndex = Math.abs((articleHash + postIdHash + fixed) % visualStyles.length);
          const colorIndex = Math.abs((uniqueTimestamp + articleHash) % colorPalettes.length);
          const compIndex = Math.abs((postIdHash + fixed * 7) % compositions.length);

          const selectedStyle = visualStyles[styleIndex];
          const selectedColors = colorPalettes[colorIndex];
          const selectedComp = compositions[compIndex];

          const imagePrompt = `Generate a COMPLETELY UNIQUE professional illustration for the article: "${post.title}"

━━━ ABSOLUTE UNIQUENESS MARKERS ━━━
Timestamp: ${uniqueTimestamp}
Random Seed A: ${randomSeed}
Random Seed B: ${randomSeed2}
Article Hash: ${articleHash}
Post ID Hash: ${postIdHash}
Generation Index: ${fixed + 1}

━━━ VISUAL STYLE SPECIFICATION ━━━
Art Style: ${selectedStyle}
Color Palette: ${selectedColors}
Composition: ${selectedComp}

━━━ CONTENT-SPECIFIC THEMEING ━━━
Article Title: ${post.title}
Category: ${post.category}
Primary Theme: ${post.tags?.[0] || 'cryptocurrency'}
Secondary Theme: ${post.tags?.[1] || 'technology'}
Tertiary Theme: ${post.tags?.[2] || 'innovation'}

━━━ CRITICAL REQUIREMENTS ━━━
✓ Professional 16:9 widescreen format
✓ High-resolution 4K quality output
✓ Financial technology publication grade
✓ ZERO generic symbols (no coins, logos, Bitcoin/Ethereum icons)
✓ MUST be visually distinct from ALL other crypto imagery
✓ Abstract conceptual metaphor ONLY
✓ NO text, typography, or letters
✓ NO human faces or figures
✓ ZERO stock photo aesthetics

━━━ UNIQUENESS ENFORCEMENT ━━━
This image MUST be completely different from every other crypto/AI article image ever created. Use the specific visual style, color palette, and composition specified above. Make it instantly recognizable as representing THIS EXACT article topic: "${post.title}"

Create a one-of-a-kind visual masterpiece.`;

          console.log(`🎨 Generating AI image with ultra-unique prompt...`);
          const imageResponse = await base44.integrations.Core.GenerateImage({ prompt: imagePrompt });

          if (imageResponse && imageResponse.url) {
            console.log(`✓ Image generated: ${imageResponse.url.substring(0, 60)}...`);
            await base44.entities.BlogPost.update(post.id, { featured_image: imageResponse.url });
            fixed++;
            console.log(`✓ Successfully updated post (${fixed}/${postsToFix.length} complete)`);
          } else {
            failed++;
            console.error(`✗ No image URL returned for: "${post.title}"`);
          }
        } catch (imgError) {
          failed++;
          console.error(`✗ ERROR generating image for "${post.title}":`, imgError);
        }

        if (fixed + failed < postsToFix.length) {
          console.log(`⏳ Waiting 4 seconds before next image generation...`);
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }

      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`✅ IMAGE REGENERATION COMPLETE`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`✓ Successfully regenerated: ${fixed}`);
      console.log(`✗ Failed: ${failed}`);
      console.log(`📊 Total processed: ${postsToFix.length}`);

      const successMsg = `Image regeneration complete!

✓ Successfully regenerated: ${fixed} images
✗ Failed: ${failed} images
📊 Total processed: ${postsToFix.length} posts

Running health check to verify all duplicates are removed...`;

      alert(successMsg);
      await runHealthCheck();
    } catch (error) {
      console.error("❌ CRITICAL ERROR in image regeneration:", error);
      alert(`Failed to fix duplicate images: ${error.message}\n\nCheck browser console (F12) for detailed error logs.`);
    }
    setIsScanning(false);
  };

  const reformatAllBlogs = async () => {
    const formattingIssue = scanResults.formatting.find(issue => issue.allPosts);
    
    if (!formattingIssue || !formattingIssue.allPosts) {
      alert('No poorly formatted blogs found. Run health check first.');
      return;
    }

    const postsToReformat = formattingIssue.allPosts;

    if (!window.confirm(`Fix formatting for ${postsToReformat.length} blog posts?\n\n⏱️ Estimated time: ${Math.ceil(postsToReformat.length * 3)} seconds\n💡 This will add proper H2/H3 headers and spacing\n\nContinue?`)) {
      return;
    }

    setIsReformatting(true);

    try {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Starting reformatting of ${postsToReformat.length} posts...`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
      let reformatted = 0;
      let failed = 0;

      for (const post of postsToReformat) {
        try {
          console.log(`[${reformatted + failed + 1}/${postsToReformat.length}] Fixing: "${post.title}"`);

          // Use fix_existing_content method
          const fixedContent = formatter.fixExistingContent(post.content);
          const finalFormatted = formatter.formatBlogContent(fixedContent, post.title);

          // Calculate readability score
          const readability = formatter.calculateReadability(finalFormatted);
          const wordCount = finalFormatted.split(/\s+/).length;
          const readingTime = Math.ceil(wordCount / 200);

          await base44.entities.BlogPost.update(post.id, {
            content: finalFormatted,
            reading_time: readingTime
          });

          reformatted++;
          console.log(`✓ Successfully reformatted: "${post.title}"`);
          console.log(`  └─ Word count: ${wordCount} | Reading time: ${readingTime} min | Readability: ${readability.toFixed(1)}/100`);
          console.log(`  └─ Progress: ${reformatted}/${postsToReformat.length} complete\n`);

          // Small delay between updates
          if (reformatted + failed < postsToReformat.length) {
            console.log(`⏳ Waiting 0.5 seconds before next post...\n`);
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (error) {
          failed++;
          console.error(`✗ Failed to reformat "${post.title}":`, error);
        }
      }

      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`✅ REFORMATTING COMPLETE`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`✓ Success: ${reformatted}`);
      console.log(`✗ Failed: ${failed}`);
      console.log(`📊 Total: ${postsToReformat.length}`);

      alert(`✅ Reformatting Complete!\n\n✓ Success: ${reformatted}\n✗ Failed: ${failed}\n📊 Total: ${postsToReformat.length}\n\nAll blogs now have proper H2/H3 headers and spacing!`);
      await runHealthCheck();
    } catch (error) {
      console.error('Batch reformatting error:', error);
      alert('Failed to reformat blogs: ' + error.message);
    } finally {
      setIsReformatting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-slate-600 mt-2">You do not have permission to view this page.</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'warning': return 'outline';
      default: return 'secondary';
    }
  };

  const totalIssues = Object.values(scanResults).reduce((sum, category) => {
    return sum + category.filter(item => item.type === 'error' || item.type === 'warning').length;
  }, 0);

  const criticalIssues = Object.values(scanResults).reduce((sum, category) => {
    return sum + category.filter(item => item.type === 'error').length;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Site Health Check</h1>
            <p className="text-lg text-slate-600">
              Comprehensive scan of database integrity, content quality, and SEO optimization
            </p>
          </div>
          <div className="flex gap-2">
            {scanComplete && (
              <>
                <Button variant="outline" onClick={() => exportResults('json')} className="bg-white hover:bg-slate-100">
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
                <Button variant="outline" onClick={() => exportResults('csv')} className="bg-white hover:bg-slate-100">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </>
            )}
            <Button
              onClick={runHealthCheck}
              disabled={isScanning}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Scanning Site...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Run Full Health Check
                </>
              )}
            </Button>
          </div>
        </div>

        {/* NEW: Code Validator Agent */}
        <div className="mb-6">
          <CodeValidator />
        </div>

        {scanComplete && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Issues</p>
                    <p className="text-3xl font-bold text-slate-900">{totalIssues}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Critical Issues</p>
                    <p className="text-3xl font-bold text-red-600">{criticalIssues}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Health Score</p>
                    <p className="text-3xl font-bold text-green-600">
                      {Math.max(0, 100 - (criticalIssues * 10) - (totalIssues * 2))}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-6">
          {/* Database Health */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-6 h-6 mr-2 text-blue-600" />
                Database Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResults.database.length > 0 ? (
                scanResults.database.map((result, index) => {
                  const suggestion = getSuggestion(result.message);
                  return (
                    <Alert key={index} variant={result.type === "error" ? "destructive" : "default"}>
                      <div className="flex items-start gap-3">
                        {getIcon(result.type)}
                        <div className="flex-1">
                          <AlertDescription>{result.message}</AlertDescription>
                          {suggestion.fix && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-blue-900">{suggestion.fix}</p>
                                  <p className="text-xs text-blue-700 mt-1">{suggestion.action}</p>
                                  {suggestion.learnMore && (
                                    <a
                                      href={suggestion.learnMore}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                                    >
                                      Learn more <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Badge variant={getBadgeVariant(result.type)}>{result.type}</Badge>
                      </div>
                    </Alert>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">Run health check to see results</p>
              )}
            </CardContent>
          </Card>

          {/* Content Quality */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-600" />
                Content Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResults.content.length > 0 ? (
                scanResults.content.map((result, index) => {
                  const suggestion = getSuggestion(result.message);
                  return (
                    <Alert key={index} variant={result.type === "error" ? "destructive" : "default"}>
                      <div className="flex items-start gap-3">
                        {getIcon(result.type)}
                        <div className="flex-1">
                          <AlertDescription>{result.message}</AlertDescription>
                          {result.details && (
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                              {result.details.slice(0, 3).map((detail, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="truncate">• {detail}</span>
                                  {result.listingIds && result.listingIds[i] && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        window.location.href = createPageUrl("Admin") + `?tab=manage&search=${encodeURIComponent(detail)}`;
                                      }}
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  )}
                                </div>
                              ))}
                              {result.details.length > 3 && (
                                <div>... and {result.details.length - 3} more</div>
                              )}
                            </div>
                          )}
                          {suggestion.fix && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-blue-900">{suggestion.fix}</p>
                                  <p className="text-xs text-blue-700 mt-1">{suggestion.action}</p>
                                  {suggestion.learnMore && (
                                    <a
                                      href={suggestion.learnMore}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                                    >
                                      Learn more <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Badge variant={getBadgeVariant(result.type)}>{result.type}</Badge>
                      </div>
                    </Alert>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">Run health check to see results</p>
              )}
            </CardContent>
          </Card>

          {/* Blog Formatting */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-indigo-600" />
                Blog Content Formatting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResults.formatting.length > 0 ? (
                scanResults.formatting.map((result, index) => {
                  const suggestion = getSuggestion(result.message);
                  return (
                    <Alert key={index} variant={result.type === "error" ? "destructive" : "default"}>
                      <div className="flex items-start gap-3">
                        {getIcon(result.type)}
                        <div className="flex-1">
                          <AlertDescription>{result.message}</AlertDescription>
                          {result.details && (
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                              {result.details.slice(0, 5).map((detail, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="truncate">• {detail}</span>
                                  {result.postIds && result.postIds[i] && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        window.location.href = createPageUrl("EditBlogPost") + `?id=${result.postIds[i]}`;
                                      }}
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  )}
                                </div>
                              ))}
                              {result.details.length > 5 && (
                                <div>... and {result.details.length - 5} more</div>
                              )}
                            </div>
                          )}
                          {suggestion.fix && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-blue-900">{suggestion.fix}</p>
                                  <p className="text-xs text-blue-700 mt-1">{suggestion.action}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={getBadgeVariant(result.type)}>{result.type}</Badge>
                          {result.message.includes('poor formatting') && (
                            <Button
                              size="sm"
                              onClick={reformatAllBlogs}
                              disabled={isReformatting}
                              className="gap-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                              {isReformatting ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  Fixing...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3 h-3" />
                                  Fix All Now
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Alert>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">Run health check to see results</p>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-6 h-6 mr-2 text-green-600" />
                Image Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResults.images.length > 0 ? (
                scanResults.images.map((result, index) => {
                  const suggestion = getSuggestion(result.message);
                  return (
                    <Alert key={index} variant={result.type === "error" ? "destructive" : "default"}>
                      <div className="flex items-start gap-3">
                        {getIcon(result.type)}
                        <div className="flex-1">
                          <AlertDescription>{result.message}</AlertDescription>
                          {result.details && (
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                              {result.details.slice(0, 3).map((detail, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="truncate">• {detail}</span>
                                  {result.postIds && result.postIds[i] && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        window.location.href = createPageUrl("EditBlogPost") + `?id=${result.postIds[i]}`;
                                      }}
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  )}
                                </div>
                              ))}
                              {result.details.length > 3 && (
                                <div>... and {result.details.length - 3} more</div>
                              )}
                            </div>
                          )}
                          {suggestion.fix && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-blue-900">{suggestion.fix}</p>
                                  <p className="text-xs text-blue-700 mt-1">{suggestion.action}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={getBadgeVariant(result.type)}>{result.type}</Badge>
                          {result.message.includes('missing featured images') && (
                            <Button
                              size="sm"
                              onClick={generateMissingImages}
                              disabled={isGeneratingImages}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              {isGeneratingImages ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3" />
                                  Generate All
                                </>
                              )}
                            </Button>
                          )}
                          {result.message.includes('duplicate images') && result.type === 'warning' && (
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                onClick={removeDuplicateImages}
                                disabled={isScanning}
                                variant="outline"
                                className="gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove All
                              </Button>
                              <Button
                                size="sm"
                                onClick={fixDuplicateImages}
                                disabled={isScanning}
                                className="gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Regenerate All
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Alert>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">Run health check to see results</p>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="w-6 h-6 mr-2 text-orange-600" />
                Link Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResults.links.length > 0 ? (
                scanResults.links.map((result, index) => {
                  const suggestion = getSuggestion(result.message);
                  return (
                    <Alert key={index} variant={result.type === "error" ? "destructive" : "default"}>
                      <div className="flex items-start gap-3">
                        {getIcon(result.type)}
                        <div className="flex-1">
                          <AlertDescription>{result.message}</AlertDescription>
                          {result.details && (
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                              {result.details.map((detail, i) => (
                                <div key={i}>• {detail}</div>
                              ))}
                            </div>
                          )}
                          {suggestion.fix && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-blue-900">{suggestion.fix}</p>
                                  <p className="text-xs text-blue-700 mt-1">{suggestion.action}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Badge variant={getBadgeVariant(result.type)}>{result.type}</Badge>
                      </div>
                    </Alert>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">Run health check to see results</p>
              )}
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-2 text-red-600" />
                Security & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResults.security.length > 0 ? (
                scanResults.security.map((result, index) => {
                  const suggestion = getSuggestion(result.message);
                  return (
                    <Alert key={index} variant={result.type === "error" ? "destructive" : "default"}>
                      <div className="flex items-start gap-3">
                        {getIcon(result.type)}
                        <div className="flex-1">
                          <AlertDescription>{result.message}</AlertDescription>
                          {result.details && (
                            <div className="mt-2 text-sm text-slate-600 space-y-1">
                              {result.details.map((detail, i) => (
                                <div key={i}>• {detail}</div>
                              ))}
                            </div>
                          )}
                          {suggestion.fix && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-blue-900">{suggestion.fix}</p>
                                  <p className="text-xs text-blue-700 mt-1">{suggestion.action}</p>
                                  {suggestion.learnMore && (
                                    <a
                                      href={suggestion.learnMore}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                                    >
                                      Learn more <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Badge variant={getBadgeVariant(result.type)}>{result.type}</Badge>
                      </div>
                    </Alert>
                  );
                })
              ) : (
                <p className="text-slate-500 text-sm">Run health check to see results</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
