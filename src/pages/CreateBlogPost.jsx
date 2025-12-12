
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Sparkles, FileText, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactMarkdown from 'react-markdown';

const templates = {
  tutorial: {
    title: "How to [Action] in [Context]",
    content: `# Introduction

Brief overview of what readers will learn.

## Prerequisites

- Requirement 1
- Requirement 2
- Requirement 3

## Step-by-Step Guide

### Step 1: [First Action]

Detailed explanation...

### Step 2: [Second Action] 

Detailed explanation...

### Step 3: [Final Action]

Detailed explanation...

## Troubleshooting

Common issues and solutions:

- **Issue 1**: Solution
- **Issue 2**: Solution

## Conclusion

Summary of what was covered and next steps.`,
    category: "Tutorial",
    tags: ["tutorial", "guide", "how-to"]
  },
  analysis: {
    title: "[Topic] Analysis: What You Need to Know",
    content: `# Executive Summary

Key takeaways in 2-3 sentences.

## Current Market Situation

Analysis of the current state...

## Key Factors to Consider

### Factor 1: [Important Point]

Detailed analysis...

### Factor 2: [Important Point]

Detailed analysis...

### Factor 3: [Important Point]

Detailed analysis...

## Potential Impact

- **Short-term**: Expected outcomes
- **Long-term**: Potential implications

## Conclusion

Final thoughts and recommendations.`,
    category: "Analysis",
    tags: ["analysis", "market", "insights"]
  },
  news: {
    title: "[Breaking/Latest]: [News Headline]",
    content: `# What Happened

Brief summary of the news...

## Key Details

- **When**: Date/timeframe
- **Who**: Key players involved
- **What**: Specific details
- **Impact**: Immediate effects

## Analysis

What this means for the industry...

## What's Next

Expected developments and timeline.

## Bottom Line

Key takeaway for readers.`,
    category: "News",
    tags: ["news", "breaking", "update"]
  }
};

export default function CreateBlogPostPage() {
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    featured_image: '',
    published: false,
    author_name: 'Joe Robertson'
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const blogSchema = await base44.entities.BlogPost.schema();
        setSchema(blogSchema);
      } catch (error) {
        console.error('Failed to load schema:', error);
      }
    };
    loadSchema();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const loadTemplate = (templateKey) => {
    if (templates[templateKey]) {
      const template = templates[templateKey];
      setFormData(prev => ({
        ...prev,
        title: template.title,
        content: template.content,
        category: template.category,
        tags: template.tags
      }));
      setSelectedTemplate(templateKey);
    }
  };

  const generateImage = async () => {
    if (!formData.title.trim()) {
      setError('Please add a title first');
      return;
    }
    
    setIsGeneratingImage(true);
    setError('');
    try {
      const uniqueTimestamp = Date.now();
      const randomSeed = Math.random().toString(36).substring(7);
      
      // Highly varied visual parameters
      const visualStyles = [
        "futuristic cyberpunk aesthetic with neon accents and digital rain",
        "minimalist geometric design with sharp angles and clean lines",
        "organic flowing shapes with soft gradients and natural curves",
        "isometric 3D illustration style with depth and dimension",
        "abstract data visualization with flowing particle lines",
        "tech blueprint schematic style with technical annotations",
        "holographic interface design with translucent layers",
        "crystalline structures with light refraction and prisms",
        "circuit board patterns with glowing interconnected nodes",
        "particle system with dynamic energy flows and connections",
        "wireframe mesh design with geometric precision",
        "liquid metal aesthetic with chrome reflections",
        "low-poly art style with faceted surfaces",
        "glitch art aesthetic with digital distortions",
        "vaporwave retro-futuristic design"
      ];
      
      const colorSchemes = [
        "electric blue and cyan with purple highlights",
        "deep indigo and gold with white accents",
        "teal and orange complementary palette",
        "violet and lime green contrasts",
        "navy blue and amber warm tones",
        "turquoise and coral vibrant mix",
        "royal purple and yellow gold",
        "forest green and pink accents",
        "crimson red and ice blue",
        "emerald green and silver metallic",
        "magenta and cyan neon glow",
        "bronze and teal industrial",
        "lavender and mint pastel tech",
        "ruby red and sapphire blue",
        "charcoal black with gold highlights"
      ];
      
      const compositions = [
        "centered focal point with radiating elements",
        "diagonal split composition with dynamic flow",
        "circular mandala pattern arrangement",
        "layered depth with foreground and background",
        "asymmetric balance with negative space",
        "grid-based modular design",
        "spiral flow from corner to center",
        "vertical ascending composition",
        "horizontal panoramic layout",
        "scattered constellation pattern",
        "rule of thirds with golden ratio",
        "symmetrical mirror reflection",
        "explosive burst from center",
        "cascading waterfall arrangement",
        "orbital rings around central hub"
      ];
      
      const randomStyle = visualStyles[Math.floor(Math.random() * visualStyles.length)];
      const randomColors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      const randomComposition = compositions[Math.floor(Math.random() * compositions.length)];
      
      const uniquePrompt = `Professional, modern, COMPLETELY UNIQUE illustration for blog post: "${formData.title}". 

      UNIQUE VISUAL SPECIFICATION:
      - Style: ${randomStyle}
      - Color scheme: ${randomColors}
      - Composition: ${randomComposition}
      - Unique seed: ${randomSeed}
      - Timestamp: ${uniqueTimestamp}
      - Topic: ${formData.title.split(' ').slice(0, 5).join(' ')}
      - Category: ${formData.category || 'Technology'}
      
      CRITICAL REQUIREMENTS:
      - 16:9 aspect ratio, high quality
      - Professional financial technology publication standard
      - NO generic cryptocurrency symbols (no coins, logos, or common blockchain imagery)
      - Must be COMPLETELY DIFFERENT from any standard crypto illustration
      - Create specific visual metaphors for: ${formData.title}
      - Include unique geometric or abstract patterns that reflect the topic
      - Make instantly recognizable as being about THIS specific article topic
      
      This image MUST be visually distinct and NOT look like other crypto/AI articles.`;
      
      const imageResponse = await base44.integrations.Core.GenerateImage({
        prompt: uniquePrompt
      });
      
      if (imageResponse && imageResponse.url) {
        setFormData(prev => ({ ...prev, featured_image: imageResponse.url }));
      }
    } catch (err) {
      setError('Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const blogData = {
        ...formData,
        slug: generateSlug(formData.title),
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        reading_time: calculateReadingTime(formData.content),
        tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(t => t.trim())
      };

      await base44.entities.BlogPost.create(blogData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to save blog post');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!schema) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4 text-lg">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <Alert className="mb-6">
          <AlertDescription>Blog post created successfully!</AlertDescription>
        </Alert>
        <div className="space-x-4">
          <Link to={createPageUrl("Admin") + '?tab=blog'}>
            <Button>Back to Blog Management</Button>
          </Link>
          <Button variant="outline" onClick={() => { setSuccess(false); setFormData({ title: '', content: '', excerpt: '', category: '', tags: [], featured_image: '', published: false, author_name: 'Joe Robertson' }); }}>
            Create Another Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl("Admin") + '?tab=blog'}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog Management
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quick Start Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(templates).map(([key, template]) => (
                  <Button
                    key={key}
                    variant={selectedTemplate === key ? "default" : "outline"}
                    onClick={() => loadTemplate(key)}
                    className="h-auto p-3 flex-col"
                  >
                    <div className="font-semibold capitalize">{key}</div>
                    <div className="text-xs text-muted-foreground">{template.category}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog post title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Excerpt (Optional)</label>
              <Textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary for SEO and previews..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog post content in Markdown..."
                className="h-96 font-mono"
                required
              />
            </div>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setFormData(prev => ({ ...prev, published: false }))}>
                Save Draft
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {formData.published ? 'Publish' : 'Save'}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schema.properties.category.enum.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <Input
                  name="tags"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="crypto, staking, DeFi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <Input
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleSwitchChange('published', checked)}
                />
                <label htmlFor="published">Publish immediately</label>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.featured_image ? (
                <div className="space-y-3">
                  <img 
                    src={formData.featured_image} 
                    alt="Featured" 
                    className="w-full h-32 object-cover rounded border"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
                    className="w-full"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-full h-32 bg-slate-100 border-2 border-dashed rounded flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateImage}
                    disabled={isGeneratingImage || !formData.title}
                    className="w-full"
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate AI Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Preview */}
          {formData.content && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {formData.content.length > 500 
                      ? formData.content.substring(0, 500) + '...' 
                      : formData.content
                    }
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
