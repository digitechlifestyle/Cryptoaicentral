import React, { useState } from "react";
import { GenerateImage } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Sparkles } from "lucide-react";

const brandAssets = [
  {
    name: "Main Logo (PNG)",
    description: "Primary logo for website and general use",
    prompt: "A professional horizontal logo with the exact text 'CRYPTO AND AI CENTRAL'. Use a sleek, modern wordmark with sophisticated typography. The text should have a blue-to-indigo-to-gold gradient effect. Include subtle geometric accents representing blockchain and AI in gold and blue tones. The background must be clean and white. Corporate luxury quality, high resolution.",
    dimensions: "1200x400"
  },
  {
    name: "Square Logo",
    description: "For profile pictures and app icons",
    prompt: "A premium square logo for 'CRYPTO AND AI CENTRAL'. It should be a sophisticated circular or hexagonal emblem with the initials 'CAAC' or an abstract symbol combining crypto and AI concepts. Use a blue-to-indigo-to-gold gradient. Include geometric patterns suggesting blockchain nodes and AI circuits in gold and blue. Professional finish with subtle shadows on a clean white background.",
    dimensions: "1000x1000"
  },
  {
    name: "YouTube Channel Banner",
    description: "YouTube channel cover image",
    prompt: "A premium YouTube channel banner with the exact text 'CRYPTO AND AI CENTRAL'. It needs a cinematic gradient background from deep blue through vibrant indigo to golden yellow. The 'CRYPTO AND AI CENTRAL' typography should be large and the main focus with gold highlights. Add a subtitle 'Your Guide to AI & Crypto Tools' in elegant gold font. Include abstract tech elements like connected nodes and AI circuit patterns in blue and gold. 2560x1440 resolution.",
    dimensions: "2560x1440"
  },
  {
    name: "Facebook Cover Photo",
    description: "Facebook page header image",
    prompt: "A professional Facebook cover with the exact text 'CRYPTO AND AI CENTRAL'. Use a stunning blue-to-indigo-to-gold gradient backdrop. The title 'CRYPTO AND AI CENTRAL' must be bold and prominent with gold accents. Add an engaging tagline: 'Discover the Best AI & Crypto Tools' in gold text. Use sophisticated geometric tech patterns in blue and gold. High-end luxury corporate design. Optimized 1200x630 format.",
    dimensions: "1200x630"
  },
  {
    name: "Twitter/X Header",
    description: "Twitter profile header image",
    prompt: "An eye-catching Twitter header with the exact text 'CRYPTO AND AI CENTRAL'. Use a dynamic blue-to-indigo-to-gold gradient background. Bold 'CRYPTO AND AI CENTRAL' branding with modern typography featuring gold highlights. Add a compelling tagline: 'Your Guide to AI & Crypto Tools' in gold. Include abstract tech elements like AI neural networks and blockchain connections in blue and gold. 1500x500 resolution.",
    dimensions: "1500x500"
  },
  {
    name: "Instagram Post with Logo",
    description: "Post for Instagram featuring the main logo",
    prompt: "A stunning Instagram post with the exact text 'CRYPTO AND AI CENTRAL'. Use a premium blue-to-indigo-to-gold gradient background with the 'CRYPTO AND AI CENTRAL' logo prominently centered with gold accents. Add the tagline 'Your Guide to AI & Crypto Tools' below the logo in gold text. Include sophisticated geometric patterns in blue and gold. High visual impact for social media. Perfect 1080x1080 square format.",
    dimensions: "1080x1080"
  },
  {
    name: "TikTok Video Template",
    description: "Vertical background for TikTok videos",
    prompt: "A TikTok video background template for 'CRYPTO AND AI CENTRAL'. It must be a vertical 9:16 format. Use a dynamic blue-to-indigo-to-gold gradient background with subtle, animated tech patterns in blue and gold. The design should leave space for text and video overlays.",
    dimensions: "1080x1920"
  },
  {
    name: "LinkedIn Company Banner",
    description: "LinkedIn business page cover",
    prompt: "A professional LinkedIn company banner for 'CRYPTO AND AI CENTRAL'. Use a sleek blue-to-indigo-to-gold gradient background. The text 'CRYPTO AND AI CENTRAL' must be prominently featured with gold highlights. Add the tagline 'Discover the Best AI & Crypto Tools' in gold text. Modern tech aesthetic with subtle geometric patterns in blue and gold. Optimized for 1200x627 resolution.",
    dimensions: "1200x627"
  },
  {
    name: "Business Card Design",
    description: "Digital business card template",
    prompt: "A business card design for 'CRYPTO AND AI CENTRAL'. Professional layout with a blue, indigo, and gold color scheme. Must include the company logo with gold accents and a clear layout for contact information. Use clean typography and modern design elements.",
    dimensions: "800x500"
  }
];

export default function BrandAssetsPage() {
  const [generatedAssets, setGeneratedAssets] = useState({});
  const [isGenerating, setIsGenerating] = useState({});

  const generateAsset = async (asset, index) => {
    setIsGenerating(prev => ({ ...prev, [index]: true }));
    
    try {
      const response = await GenerateImage({
        prompt: asset.prompt
      });
      
      setGeneratedAssets(prev => ({
        ...prev,
        [index]: response.url
      }));
    } catch (error) {
      console.error("Failed to generate asset:", error);
    } finally {
      setIsGenerating(prev => ({ ...prev, [index]: false }));
    }
  };

  const generateAllAssets = async () => {
    for (let i = 0; i < brandAssets.length; i++) {
      await generateAsset(brandAssets[i], i);
      // Add small delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Brand Assets
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Generate and download professional brand assets for CRYPTO AND AI CENTRAL
          </p>
          
          <Button 
            onClick={generateAllAssets}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate All Assets
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandAssets.map((asset, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{asset.name}</CardTitle>
                <p className="text-sm text-slate-600">{asset.description}</p>
                <p className="text-xs text-slate-500">Dimensions: {asset.dimensions}</p>
              </CardHeader>
              <CardContent>
                {generatedAssets[index] ? (
                  <div className="space-y-4">
                    <img 
                      src={generatedAssets[index]} 
                      alt={asset.name}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <a 
                      href={generatedAssets[index]} 
                      download={`crypto-and-ai-central-${asset.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ) : (
                  <Button
                    onClick={() => generateAsset(asset, index)}
                    disabled={isGenerating[index]}
                    variant="outline"
                    className="w-full"
                  >
                    {isGenerating[index] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Usage Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Brand Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-blue-600"></div>
                  <span className="text-sm">Primary Blue: #3B82F6</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-indigo-600"></div>
                  <span className="text-sm">Secondary Indigo: #4F46E5</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Recommended Sizes</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• YouTube: 2560x1440px</li>
                <li>• Facebook Cover: 1200x630px</li>
                <li>• Twitter Header: 1500x500px</li>
                <li>• Instagram: 1080x1080px</li>
                <li>• LinkedIn: 1200x627px</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}