
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BlogPost } from '@/api/entities'; // Keep this import as it's used for schema definition example in the original
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, Loader2, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactMarkdown from 'react-markdown';
import SocialMediaThreadGenerator from '../components/admin/SocialMediaThreadGenerator';

export default function EditBlogPostPage() {
    const [schema, setSchema] = useState(null); // Added schema state
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();

    useEffect(() => {
        const loadData = async () => { // Combined fetch logic into loadData
            try {
                const blogSchema = await base44.entities.BlogPost.schema();
                setSchema(blogSchema);

                const params = new URLSearchParams(location.search);
                const postId = params.get('id');
                
                if (!postId) {
                    setError('No post ID provided in URL.');
                    setIsLoading(false);
                    return;
                }

                const results = await base44.entities.BlogPost.filter({ id: postId });
                if (results.length > 0) {
                    setPost(results[0]);
                } else {
                    setError('Post not found.');
                }
            } catch (err) {
                setError('Failed to load data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [location.search]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name, checked) => {
        setPost(prev => ({ ...prev, [name]: checked }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        setError('');
        setSuccessMessage('');
        try {
            const { id, created_date, updated_date, created_by, ...updateData } = post;
            await base44.entities.BlogPost.update(post.id, updateData);
            setSuccessMessage('Post updated successfully!');
        } catch (err) {
            setError('Failed to save changes.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleRegenerateImage = async () => {
        if (!post || !post.title) return;
        setIsGeneratingImage(true);
        setError('');
        try {
            const uniqueTimestamp = Date.now();
            const randomSeed = Math.random().toString(36).substring(7);
            
            const visualStyles = [
                'abstract flowing data streams',
                'geometric network patterns',
                'particle system visualization',
                'circuit pathways with energy',
                'crystalline network structures',
                'holographic interface design',
                'isometric 3D wireframes',
                'liquid gradient flows',
                'low-poly faceted surfaces',
                'glowing wireframe networks'
            ];
            
            const colorPalettes = [
                'electric blue, cyan, and purple gradient',
                'indigo, gold, and white tones',
                'teal and orange complementary',
                'violet and lime contrast',
                'navy and amber warm',
                'turquoise and coral vibrant',
                'emerald and silver metallic',
                'deep blue with golden accents',
                'purple-pink gradient flow',
                'cobalt and tangerine energy'
            ];
            
            const randomStyle = visualStyles[Math.floor(Math.random() * visualStyles.length)];
            const randomColors = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

            const uniquePrompt = `Professional editorial illustration for: "${post.title}"

UNIQUE IMAGE REQUIREMENTS:
- Timestamp: ${uniqueTimestamp}
- Seed: ${randomSeed}
- Category: ${post.category}
- Visual style: ${randomStyle}
- Color palette: ${randomColors}

TECHNICAL SPECIFICATIONS:
- 16:9 landscape aspect ratio
- High resolution, publication quality
- Modern financial technology aesthetic
- Professional, minimalist design

ABSOLUTE RESTRICTIONS - CRITICAL:
❌ NO text, letters, numbers, or typography
❌ NO Bitcoin logos, Ethereum symbols, or crypto currency logos
❌ NO coins, currency symbols ($, ₿, Ξ), or coin imagery
❌ NO human figures, faces, or people
❌ NO specific company logos or brand marks
❌ NO literal symbols or icons

✅ ONLY ABSTRACT ELEMENTS:
- Flowing data visualization patterns
- Geometric network structures and nodes
- Particle systems and light trails
- Circuit board pathways and connections
- Gradient energy flows
- Wireframe architectural forms
- Crystalline technological structures
- Holographic interface elements

VISUAL CONCEPT:
Create a completely unique, abstract representation of "${post.title}" using ${randomStyle} in ${randomColors}. 

The image must be purely conceptual and technological - using geometric shapes, flowing energy patterns, network visualizations, and light effects to convey innovation and sophistication WITHOUT any literal symbols.`;

            const imageResponse = await base44.integrations.Core.GenerateImage({
                prompt: uniquePrompt
            });
            
            if (imageResponse && imageResponse.url) {
                setPost(prev => ({ ...prev, featured_image: imageResponse.url }));
                setSuccessMessage('New unique image generated. Remember to save your changes.');
            } else {
                setError('Failed to generate a valid image URL.');
            }
        } catch (err) {
            setError('Image generation failed.');
            console.error(err);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    // Removed the direct call to BlogPost.schema() here

    if (isLoading || !schema) { // Added schema to loading check
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
                <span className="ml-3">Loading...</span>
            </div>
        );
    }

    if (!post) { // Moved post not found/error handling here
        return (
            <div className="max-w-2xl mx-auto py-16">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error || "The blog post you're trying to edit doesn't exist or could not be loaded."}</AlertDescription>
                </Alert>
                <Link to={createPageUrl("Admin") + '?tab=blog'}>
                    <Button className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog Management
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
            <div className="max-w-7xl mx-auto">
                <Link to={createPageUrl("Admin") + '?tab=blog'}>
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog Management
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

                {/* Removed the conditional loading/error block from here */}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image</label>
                            {post.featured_image ? (
                                <img src={post.featured_image} alt={post.title} className="rounded-lg w-full max-h-64 object-cover border" />
                            ) : (
                                <div className="w-full h-48 bg-slate-100 border-2 border-dashed rounded-lg flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-slate-400" />
                                </div>
                            )}
                            <Button onClick={handleRegenerateImage} disabled={isGeneratingImage} variant="outline" className="mt-2">
                                {isGeneratingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                Regenerate Image
                            </Button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <Input name="title" value={post.title} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                            <Textarea name="excerpt" value={post.excerpt} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown)</label>
                            <Textarea name="content" value={post.content} onChange={handleInputChange} className="h-96 font-mono" />
                        </div>
                        <div className="prose prose-lg max-w-none border p-4 rounded-md bg-slate-50">
                            <ReactMarkdown>{post.content || "Content preview will appear here."}</ReactMarkdown>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <Select value={post.category || ''} onValueChange={(v) => handleSelectChange('category', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        {/* Now using the fetched schema state */}
                                        {schema.properties.category.enum.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                                <Input name="tags" value={Array.isArray(post.tags) ? post.tags.join(', ') : ''} onChange={(e) => setPost(p => ({...p, tags: e.target.value.split(',').map(t => t.trim())}))} />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <Switch id="published" checked={post.published} onCheckedChange={(c) => handleSwitchChange('published', c)} />
                                <label htmlFor="published">Published</label>
                            </div>
                        </div>

                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        {successMessage && <Alert><CheckCircle className="h-4 w-4" /><AlertDescription>{successMessage}</AlertDescription></Alert>}

                        <div className="flex justify-end">
                            <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar column - 1/3 width */}
                    <div className="space-y-6">
                        <SocialMediaThreadGenerator post={post} />
                    </div>
                </div>
            </div>
        </div>
    );
}
