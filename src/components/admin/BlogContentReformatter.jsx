import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle, AlertCircle, FileEdit, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

// Advanced Blog Formatter (JavaScript version of Python BlogFormatter)
class BlogFormatter {
  constructor() {
    this.sectionKeywords = [
      'introduction', 'what is', 'types', 'categories', 'examples', 'platforms',
      'how it works', 'technical', 'process', 'security', 'risk', 'management',
      'tools', 'strategies', 'regulatory', 'industry', 'landscape', 'future',
      'trends', 'innovations', 'how to choose', 'evaluation', 'guide',
      'frequently asked', 'faq', 'conclusion', 'next steps'
    ];
  }

  formatBlogContent(content, title) {
    if (!content) return content;

    // Split into lines
    const lines = content.split('\n');
    const formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines (we'll add them back strategically)
      if (!line) {
        formattedLines.push('');
        continue;
      }

      // Check if this should be a header
      const headerLevel = this.detectHeaderLevel(line, i, lines);
      
      if (headerLevel === 1) {
        // H1 - Main title
        formattedLines.push('');
        formattedLines.push(`# ${this.cleanHeaderText(line)}`);
        formattedLines.push('');
      } else if (headerLevel === 2) {
        // H2 - Main sections
        formattedLines.push('');
        formattedLines.push('');
        formattedLines.push(`## ${this.cleanHeaderText(line)}`);
        formattedLines.push('');
      } else if (headerLevel === 3) {
        // H3 - Subsections
        formattedLines.push('');
        formattedLines.push(`### ${this.cleanHeaderText(line)}`);
        formattedLines.push('');
      } else if (this.isListItem(line)) {
        // List items
        formattedLines.push(this.formatListItem(line));
      } else if (this.isCalloutBox(line)) {
        // Callout boxes (Key Takeaway, Pro Tip)
        formattedLines.push('');
        formattedLines.push(line);
        formattedLines.push('');
      } else if (this.isTableRow(line)) {
        // Table rows
        formattedLines.push(line);
      } else {
        // Regular paragraph
        const formatted = this.formatParagraph(line);
        formattedLines.push(formatted);
      }
    }

    // Join and clean up spacing
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

    // Short lines that look like headers
    const isShort = line.length < 100;
    const hasNoEndPunctuation = !line.match(/[.!?,;]$/);
    const startsWithCapital = /^[A-Z]/.test(line);
    
    // Check if it's bold (might be a subheading)
    const isBold = line.startsWith('**') && line.endsWith('**');
    
    // Numbered list headers (1., 2., etc)
    const isNumberedHeader = /^\d+\.\s+[A-Z]/.test(line) && line.length < 80;

    // Look at next line for context
    const nextLine = index + 1 < allLines.length ? allLines[index + 1].trim() : '';
    const followedByContent = nextLine && nextLine.length > 20;

    if (isSection && isShort && hasNoEndPunctuation) {
      return 2; // H2 for main sections
    }

    if (isBold && isShort && followedByContent) {
      return 3; // H3 for bold subheadings
    }

    if (isNumberedHeader) {
      return 3; // H3 for numbered sections
    }

    if (startsWithCapital && isShort && hasNoEndPunctuation && followedByContent && !line.includes(',')) {
      return 3; // H3 for short capitalized lines
    }

    return 0; // Not a header
  }

  cleanHeaderText(line) {
    // Remove existing markdown
    let clean = line.replace(/^#+\s*/, '');
    // Remove bold markers
    clean = clean.replace(/^\*\*/, '').replace(/\*\*$/, '');
    // Remove trailing punctuation except ?
    clean = clean.replace(/[.:;,]$/, '');
    // Remove numbered list markers
    clean = clean.replace(/^\d+\.\s+/, '');
    return clean.trim();
  }

  isListItem(line) {
    return line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/);
  }

  formatListItem(line) {
    // Normalize to dash format
    let formatted = line.replace(/^[*•]\s/, '- ');
    
    // Bold any label before a colon
    formatted = formatted.replace(/^([-\d.]+\s+)([A-Z][^:]+)(:)/g, '$1**$2**$3');
    
    return formatted;
  }

  isCalloutBox(line) {
    return line.match(/^[💡🎯✅🔍⚡]\s*\*\*/) || line.match(/^(Key Takeaway|Pro Tip|Important|Note):/i);
  }

  isTableRow(line) {
    return line.includes('|') && line.split('|').length > 2;
  }

  formatParagraph(line) {
    // Bold labels (Label: or **Label:**)
    let formatted = line.replace(/^([A-Z][a-zA-Z\s]+):/g, '**$1:**');
    
    // Ensure consistent bold formatting
    formatted = formatted.replace(/\*\s*\*/g, '**');
    
    return formatted;
  }

  ensureProperSpacing(content) {
    // Remove excessive blank lines (max 2)
    content = content.replace(/\n{4,}/g, '\n\n\n');
    
    // Ensure blank lines around H2 headers
    content = content.replace(/([^\n])\n(##\s)/g, '$1\n\n\n$2');
    content = content.replace(/(##\s[^\n]+)\n([^\n])/g, '$1\n\n$2');
    
    // Ensure blank line around H3 headers
    content = content.replace(/([^\n])\n(###\s)/g, '$1\n\n$2');
    content = content.replace(/(###\s[^\n]+)\n([^\n])/g, '$1\n\n$2');
    
    // Ensure blank lines around callout boxes
    content = content.replace(/([^\n])\n([💡🎯✅])/g, '$1\n\n$2');
    content = content.replace(/([💡🎯✅][^\n]+)\n([^\n💡🎯✅])/g, '$1\n\n$2');
    
    // Ensure blank lines around horizontal rules
    content = content.replace(/([^\n])\n(---)/g, '$1\n\n$2');
    content = content.replace(/(---)\n([^\n])/g, '$1\n\n$2');
    
    // No blank lines within lists
    content = content.replace(/(-\s[^\n]+)\n\n(-\s)/g, '$1\n$2');
    
    return content.trim();
  }
}

export default function BlogContentReformatter() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isReformatting, setIsReformatting] = useState(false);
  const [reformattedContent, setReformattedContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchResults, setBatchResults] = useState([]);
  const [error, setError] = useState('');

  const formatter = new BlogFormatter();

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    setError('');
    try {
      const allPosts = await base44.entities.BlogPost.list('-created_date', 200);
      setPosts(allPosts);
    } catch (err) {
      setError('Failed to load blog posts: ' + err.message);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  React.useEffect(() => {
    loadPosts();
  }, []);

  const handlePostSelect = (postId) => {
    setSelectedPostId(postId);
    const post = posts.find(p => p.id === postId);
    setSelectedPost(post);
    setReformattedContent('');
    setShowPreview(false);
    setError('');
  };

  const reformatSinglePost = async () => {
    if (!selectedPost) return;

    setIsReformatting(true);
    setError('');
    setReformattedContent('');

    try {
      // First, use local formatter to clean up basic structure
      const locallyFormatted = formatter.formatBlogContent(selectedPost.content, selectedPost.title);

      // Then send to AI for comprehensive rewrite with full structure
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional blog editor. Reformat this content into a comprehensive, SEO-optimized article.

**ORIGINAL TITLE:** ${selectedPost.title}

**CURRENT CONTENT:**
${locallyFormatted}

**YOUR TASK:**
Transform this into a complete, professional article with the following EXACT structure:

# ${selectedPost.title}

## Introduction

[Write 2-3 engaging paragraphs that hook the reader and explain why this topic matters]

**TL;DR:** [2-3 sentence summary of the key points]

---

## What Is ${selectedPost.title.replace(/^(The|A|An)\s+/i, '')}?

[Comprehensive definition and explanation in 2-3 detailed paragraphs]

### Core Characteristics

- **Characteristic 1**: [Specific explanation]
- **Characteristic 2**: [Specific explanation]
- **Characteristic 3**: [Specific explanation]
- **Characteristic 4**: [Specific explanation]

💡 **Key Takeaway**: [One powerful sentence]

---

## Types and Categories

[Introduction paragraph]

### Type 1: [Specific Name]

**Definition:** [Clear explanation]

**Key Features:**
- [Feature A with details]
- [Feature B with details]
- [Feature C with details]

**Best For:** [Target audience/use case]

### Type 2: [Specific Name]

[Same structure as Type 1]

### Type 3: [Specific Name]

[Same structure]

### Comparison Table

| Type | Key Features | Best For | Cost Range |
|------|-------------|----------|------------|
| Type 1 | [Summary] | [Use case] | [Price] |
| Type 2 | [Summary] | [Use case] | [Price] |
| Type 3 | [Summary] | [Use case] | [Price] |

🎯 **Pro Tip**: [Actionable advice]

---

## Leading Examples and Platforms

[Introduction]

### 1. [Platform Name]

**Overview:** [2-3 sentences]

**Standout Features:**
- [Feature 1 with specific details]
- [Feature 2 with specific details]
- [Feature 3 with specific details]

**Track Record:** [Achievements and metrics]

### 2. [Platform Name]

[Same structure]

### 3. [Platform Name]

[Same structure]

💡 **Key Takeaway**: [Main insight]

---

## How It Works: Technical Overview

[2-3 paragraphs explaining the process]

### The Process

1. **Step 1: [Name]**
   - [What happens]
   - [Why it matters]

2. **Step 2: [Name]**
   - [What happens]
   - [Why it matters]

3. **Step 3: [Name]**
   - [What happens]
   - [Why it matters]

4. **Step 4: [Name]**
   - [What happens]
   - [Why it matters]

### Performance Considerations

- **Factor 1**: [Detailed explanation]
- **Factor 2**: [Detailed explanation]
- **Factor 3**: [Detailed explanation]

---

## Security and Risk Management

[Introduction paragraph]

### Common Risks

1. **Risk 1: [Specific Name]**
   - **Description**: [What it is]
   - **Impact**: [Consequences]
   - **Mitigation**: [Protection strategy]

2. **Risk 2: [Specific Name]**
   - **Description**: [What it is]
   - **Impact**: [Consequences]
   - **Mitigation**: [Protection strategy]

3. **Risk 3: [Specific Name]**
   - **Description**: [What it is]
   - **Impact**: [Consequences]
   - **Mitigation**: [Protection strategy]

### Best Practices Checklist

- ✅ [Practice 1 - specific and actionable]
- ✅ [Practice 2 - detailed]
- ✅ [Practice 3 - clear]
- ✅ [Practice 4 - specific]
- ✅ [Practice 5 - actionable]
- ✅ [Practice 6 - detailed]

🎯 **Pro Tip**: [Critical security advice]

---

## Tools and Strategies

[Introduction]

### Recommended Tools

1. **[Tool Name]**
   - **Purpose**: [What it does]
   - **Key Feature**: [Main capability]
   - **Best For**: [Target user]
   - **Cost**: [Pricing]

2. **[Tool Name]**
   - **Purpose**: [Function]
   - **Key Feature**: [Capability]
   - **Best For**: [User type]
   - **Cost**: [Price]

3. **[Tool Name]**
   - **Purpose**: [What it does]
   - **Key Feature**: [Top feature]
   - **Best For**: [Use case]
   - **Cost**: [Pricing]

### Implementation Strategies

**For Beginners:**
- [Strategy 1 - specific and actionable]
- [Strategy 2 - beginner-friendly]
- [Strategy 3 - simple]
- [Strategy 4 - foundational]

**For Intermediate Users:**
- [Strategy 1 - advanced technique]
- [Strategy 2 - optimization]
- [Strategy 3 - scaling]

**For Advanced Users:**
- [Strategy 1 - expert-level]
- [Strategy 2 - complex]
- [Strategy 3 - advanced]

💡 **Key Takeaway**: [Strategic insight]

---

## Regulatory and Industry Landscape

[Overview]

### Global Regulations

- **United States**: [Regulatory approach, key agencies, current status]
- **European Union**: [Framework, directives, regulations]
- **Asia-Pacific**: [Regional approach, key jurisdictions]
- **Other Regions**: [Additional important markets]

### Compliance Standards

- **Standard 1**: [Requirements and who must comply]
- **Standard 2**: [Requirements and applicability]
- **Standard 3**: [Compliance obligations]

### Industry Organizations

- **[Organization Name]**: [Role, influence, initiatives]
- **[Organization Name]**: [Mission and industry impact]

---

## Future Trends and Innovations

[Introduction about direction]

### What's Coming in 2024-2028

1. **Trend 1: [Specific Innovation]**
   - **Description**: [What it is]
   - **Impact**: [How it changes the landscape]
   - **Timeline**: [When to expect it]
   - **Key Players**: [Who's leading]

2. **Trend 2: [Specific Innovation]**
   - **Description**: [Nature of trend]
   - **Impact**: [Expected changes]
   - **Timeline**: [Projected timeline]
   - **Key Players**: [Main developers]

3. **Trend 3: [Specific Innovation]**
   - **Description**: [What's emerging]
   - **Impact**: [Potential transformation]
   - **Timeline**: [When it becomes reality]
   - **Key Players**: [Companies to watch]

### AI Integration

[2-3 paragraphs on AI transformation with specific examples]

### Sustainability and Ethics

[2 paragraphs on environmental impact and ethical considerations]

🎯 **Pro Tip**: [How to prepare for changes]

---

## How to Choose: Complete Evaluation Guide

[Introduction to framework]

### Decision Framework

**Must-Have Features:**
- [ ] [Critical feature 1 - why essential]
- [ ] [Critical feature 2 - importance]
- [ ] [Critical feature 3 - why can't skip]
- [ ] [Critical feature 4 - key requirement]

**Nice-to-Have Features:**
- [ ] [Optional feature 1 - adds value]
- [ ] [Optional feature 2 - beneficial]
- [ ] [Optional feature 3 - quality-of-life]

### Key Evaluation Factors

1. **Cost Analysis**
   - [Upfront costs considerations]
   - [Ongoing fees to factor]
   - [Hidden costs to watch for]
   - [ROI expectations]

2. **Security Assessment**
   - [Security features to verify]
   - [Red flags to avoid]
   - [Track record evaluation]
   - [Audit requirements]

3. **Reliability Check**
   - [Uptime expectations]
   - [Performance benchmarks]
   - [Support quality indicators]
   - [Community feedback]

4. **User Experience**
   - [Ease of use factors]
   - [Learning curve]
   - [Interface quality]
   - [Mobile experience]

5. **Integration Capabilities**
   - [Compatibility requirements]
   - [API availability]
   - [Ecosystem connections]
   - [Migration considerations]

### Recommendations by User Type

**For Beginners:**
- **Recommendation 1: [Platform]**
  - Why ideal for newcomers
  - Beginner-friendly features
  - Learning resources
  - Reasonable cost

- **Recommendation 2: [Platform]**
  - Benefits for beginners
  - Simple onboarding
  - Community support
  - Affordable pricing

**For Intermediate Users:**
- **Recommendation 1: [Platform]**
  - Advanced features
  - Scalability options
  - Integration capabilities
  - Value for money

- **Recommendation 2: [Platform]**
  - Suitable for expanding needs
  - Enhanced functionality
  - Performance balance
  - Mid-tier pricing

**For Advanced/Enterprise:**
- **Recommendation 1: [Platform]**
  - Enterprise-grade features
  - Maximum performance
  - Extensive integrations
  - Premium support
  - Custom solutions

- **Recommendation 2: [Platform]**
  - Advanced capabilities
  - High-volume handling
  - Institutional-grade security
  - Dedicated management

💡 **Key Takeaway**: [Main selection advice]

---

## Frequently Asked Questions

**Q: [Most common question]?**

A: [Comprehensive 2-3 sentence answer with specific information and examples]

**Q: [Technical question]?**

A: [Detailed answer explaining technical aspects accessibly]

**Q: [Security/safety question]?**

A: [Reassuring answer with facts, best practices, risk mitigation]

**Q: [Cost/value question]?**

A: [Answer with specific ranges, value propositions, ROI considerations]

**Q: [Comparison question]?**

A: [Answer highlighting differences, pros/cons, suitability]

**Q: [Getting started question]?**

A: [Step-by-step answer with actionable steps and resources]

**Q: [Advanced usage question]?**

A: [Expert-level answer with technical details and optimization tips]

**Q: [Future trends question]?**

A: [Forward-looking answer with predictions, timeline, preparation advice]

---

## Conclusion

[2-3 paragraph conclusion summarizing key insights]

[Reinforce why this matters and how readers benefit]

[End with encouragement and clear next steps]

**Your Next Steps:**
1. [Actionable step 1 - specific and achievable]
2. [Actionable step 2 - clear next action]
3. [Actionable step 3 - path forward]

🎯 **Final Tip**: [Motivational closing with specific immediate action]

---

*Continue exploring our comprehensive guides on [related topic 1], [related topic 2], and [related topic 3] to deepen your expertise in the crypto and AI space.*

**CRITICAL FORMATTING RULES:**
- Use ## for ALL main sections (with blank lines before/after)
- Use ### for ALL subsections (with blank lines before/after)
- ONE blank line between paragraphs
- Use **bold** for ALL labels and key terms
- Use - for bullet points (not • or *)
- Include 💡 Key Takeaway and 🎯 Pro Tip boxes
- Proper markdown table syntax
- Target 2,000-2,500 words
- NO meta comments - ONLY the article

Generate the complete reformatted article now.`
      });

      const content = response.text_response || response;
      
      // Apply local formatter one more time to ensure consistency
      const finalFormatted = formatter.formatBlogContent(content, selectedPost.title);
      
      setReformattedContent(finalFormatted);
      setShowPreview(true);

    } catch (err) {
      console.error('Reformatting error:', err);
      setError('Failed to reformat post: ' + err.message);
    } finally {
      setIsReformatting(false);
    }
  };

  const handleSaveReformattedPost = async () => {
    if (!selectedPost || !reformattedContent) return;

    setIsReformatting(true);
    try {
      await base44.entities.BlogPost.update(selectedPost.id, {
        content: reformattedContent
      });
      
      alert('✅ Blog post reformatted and saved successfully!');
      setReformattedContent('');
      setShowPreview(false);
      setSelectedPostId('');
      setSelectedPost(null);
      await loadPosts();
      
    } catch (err) {
      setError('Failed to save reformatted post: ' + err.message);
    } finally {
      setIsReformatting(false);
    }
  };

  const handleBatchReformat = async () => {
    if (posts.length === 0) {
      alert('No posts to reformat');
      return;
    }

    const confirmed = window.confirm(
      `Reformat ALL ${posts.length} blog posts?\n\n` +
      `⏱️ Estimated time: ${Math.ceil(posts.length * 30 / 60)} minutes\n` +
      `💡 Each post takes ~30 seconds to reformat\n\n` +
      `This will overwrite existing content. Continue?`
    );

    if (!confirmed) return;

    setIsBatchProcessing(true);
    setBatchProgress({ current: 0, total: posts.length });
    setBatchResults([]);
    setError('');

    const results = [];

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      try {
        // Use same process as single post
        const locallyFormatted = formatter.formatBlogContent(post.content, post.title);
        
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `Reformat this blog into professional SEO-optimized markdown.

Title: "${post.title}"
Content: ${locallyFormatted.substring(0, 4000)}...

Output comprehensive article with:
- ## H2 headings for main sections
- ### H3 headings for subsections  
- Proper spacing (blank lines between sections)
- **Bold labels** for features
- Bullet lists, tables, FAQ sections
- Target 2000+ words

NO meta comments - ONLY the formatted article.`
        });

        const aiFormatted = response.text_response || response;
        const finalFormatted = formatter.formatBlogContent(aiFormatted, post.title);
        
        await base44.entities.BlogPost.update(post.id, {
          content: finalFormatted
        });

        results.push({ title: post.title, success: true });
        console.log(`✅ [${i + 1}/${posts.length}] Reformatted: "${post.title}"`);
        
      } catch (err) {
        results.push({ title: post.title, success: false, error: err.message });
        console.error(`❌ [${i + 1}/${posts.length}] Failed: "${post.title}"`, err);
      }

      setBatchProgress({ current: i + 1, total: posts.length });
      setBatchResults([...results]);

      // Delay between requests
      if (i < posts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setIsBatchProcessing(false);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    alert(
      `🎉 Batch Reformatting Complete!\n\n` +
      `✅ Success: ${successCount}\n` +
      `❌ Failed: ${failCount}\n` +
      `📊 Total: ${posts.length}`
    );

    await loadPosts();
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileEdit className="w-7 h-7 text-purple-600" />
          Blog Content Reformatter
        </CardTitle>
        <CardDescription className="text-base">
          Reformat existing blog posts into proper SEO-optimized markdown structure with H2/H3 headings, proper spacing, and comprehensive sections.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Select Blog Post</h3>
            <Button
              onClick={loadPosts}
              variant="outline"
              size="sm"
              disabled={isLoadingPosts}
            >
              {isLoadingPosts ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh List
            </Button>
          </div>

          <Select value={selectedPostId} onValueChange={handlePostSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a blog post to reformat..." />
            </SelectTrigger>
            <SelectContent>
              {posts.map(post => (
                <SelectItem key={post.id} value={post.id}>
                  {post.title} ({post.published ? 'Published' : 'Draft'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPost && (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Selected Post</AlertTitle>
                <AlertDescription>
                  <strong>{selectedPost.title}</strong>
                  <br />
                  Category: {selectedPost.category} | 
                  Status: {selectedPost.published ? 'Published' : 'Draft'} |
                  Words: {selectedPost.content.split(/\s+/).length}
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={reformatSinglePost}
                  disabled={isReformatting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {isReformatting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Reformatting... (~30 seconds)
                    </>
                  ) : (
                    <>
                      <FileEdit className="w-5 h-5 mr-2" />
                      Reformat This Post
                    </>
                  )}
                </Button>

                {reformattedContent && (
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    size="lg"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                )}
              </div>
            </div>
          )}

          {reformattedContent && showPreview && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Reformatting Complete!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Review the reformatted content below. If it looks good, click "Save Reformatted Content" to apply the changes.
                </AlertDescription>
              </Alert>

              <div className="border-2 border-purple-200 rounded-lg p-6 max-h-[600px] overflow-y-auto bg-white">
                <div className="prose prose-slate prose-lg max-w-none">
                  <ReactMarkdown>{reformattedContent}</ReactMarkdown>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveReformattedPost}
                  disabled={isReformatting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isReformatting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  )}
                  Save Reformatted Content
                </Button>
                
                <Button
                  onClick={() => {
                    setReformattedContent('');
                    setShowPreview(false);
                  }}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-6 space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h4 className="font-semibold text-amber-900 mb-2">⚡ Batch Processing</h4>
            <p className="text-sm text-amber-800 mb-3">
              Reformat ALL blog posts automatically. This takes approximately 30 seconds per post.
            </p>
            <Button
              onClick={handleBatchReformat}
              disabled={isBatchProcessing || posts.length === 0}
              variant="outline"
              className="border-amber-300 hover:bg-amber-100"
            >
              {isBatchProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing... {batchProgress.current}/{batchProgress.total}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reformat All Posts ({posts.length})
                </>
              )}
            </Button>
          </div>

          {isBatchProcessing && (
            <div className="space-y-3">
              <Progress value={(batchProgress.current / batchProgress.total) * 100} className="h-3" />
              <p className="text-sm text-center text-slate-600">
                Processing {batchProgress.current} of {batchProgress.total} posts...
              </p>
            </div>
          )}

          {batchResults.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {batchResults.map((result, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                  <span className="flex-1 truncate">{result.title}</span>
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}