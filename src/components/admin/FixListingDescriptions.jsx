
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

export default function FixListingDescriptions() {
  const [listings, setListings] = useState([]);
  const [shortListings, setShortListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFixing, setIsFixing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentPreview, setCurrentPreview] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const allListings = await base44.entities.DirectoryListing.list('-created_date', 500);
      const shortOnes = allListings.filter(l => 
        !l.description || l.description.length < 150
      );
      
      console.log(`Found ${shortOnes.length} listings with short descriptions`);
      setListings(allListings);
      setShortListings(shortOnes);
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
    setIsLoading(false);
  };

  const enhanceDescription = async (listing) => {
    const prompt = `You are a professional copywriter for CryptoAI Central, a directory of crypto and AI tools.

Write a compelling, SEO-optimized description for this project:

Project Name: ${listing.name}
Category: ${listing.category}
Type: ${listing.type}
Blockchain: ${listing.chain}
Tags: ${listing.tags?.join(', ') || 'N/A'}
Current Description: ${listing.description || 'No description provided'}
Website: ${listing.website}

REQUIREMENTS:
- Length: 150-200 characters (2-3 sentences maximum)
- First sentence: What it does and its primary value proposition
- Second sentence: Key features or unique benefits
- Tone: Professional, informative, engaging
- Include relevant keywords naturally (${listing.category}, ${listing.chain}, ${listing.tags?.[0]})
- NO marketing fluff or hype
- Focus on utility and real use cases
- Make it scannable and easy to understand

OUTPUT: Return ONLY the description text, nothing else.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      const enhanced = response.text_response || response;
      
      const cleaned = enhanced
        .replace(/^["']|["']$/g, '')
        .replace(/^Description:\s*/i, '')
        .trim();
      
      return cleaned;
    } catch (error) {
      console.error(`Failed to enhance description for ${listing.name}:`, error);
      throw error;
    }
  };

  const handleFixAll = async () => {
    if (shortListings.length === 0) {
      alert('No listings with short descriptions found!');
      return;
    }

    const confirmMsg = `Fix descriptions for ${shortListings.length} listings?

⏱️ Estimated time: ${Math.ceil(shortListings.length * 3 / 60)} minutes

This will:
✓ Generate SEO-optimized descriptions
✓ Maintain technical accuracy
✓ Save automatically to database

Continue?`;

    if (!window.confirm(confirmMsg)) return;

    setIsFixing(true);
    setProgress({ current: 0, total: shortListings.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < shortListings.length; i++) {
      const listing = shortListings[i];
      console.log(`\n[${i + 1}/${shortListings.length}] Enhancing: "${listing.name}"`);

      try {
        const enhanced = await enhanceDescription(listing);
        
        console.log(`Original: ${listing.description || '(none)'}`);
        console.log(`Enhanced: ${enhanced}`);
        
        await base44.entities.DirectoryListing.update(listing.id, { 
          description: enhanced 
        });
        
        successCount++;
        setProgress({ current: i + 1, total: shortListings.length });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`✗ Failed for "${listing.name}":`, error);
        failCount++;
      }
    }

    console.log(`\n✅ COMPLETE: ${successCount} success, ${failCount} failed`);
    alert(`Description enhancement complete!\n\n✓ Fixed: ${successCount}\n✗ Failed: ${failCount}`);
    
    setIsFixing(false);
    await loadListings();
  };

  const handleFixSelected = async () => {
    if (selectedIds.length === 0) {
      alert('Please select listings to fix');
      return;
    }

    const listingsToFix = shortListings.filter(l => selectedIds.includes(l.id));
    
    setIsFixing(true);
    setProgress({ current: 0, total: listingsToFix.length });

    let successCount = 0;

    for (let i = 0; i < listingsToFix.length; i++) {
      const listing = listingsToFix[i];
      try {
        const enhanced = await enhanceDescription(listing);
        await base44.entities.DirectoryListing.update(listing.id, { description: enhanced });
        successCount++;
        setProgress({ current: i + 1, total: listingsToFix.length });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed for "${listing.name}":`, error);
      }
    }

    alert(`Fixed ${successCount} descriptions!`);
    setIsFixing(false);
    setSelectedIds([]);
    await loadListings();
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(shortListings.map(l => l.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg">Loading listings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-orange-500" />
          Fix Short Listing Descriptions
        </CardTitle>
        <CardDescription>
          {shortListings.length} listings have descriptions shorter than 150 characters. Generate SEO-optimized descriptions automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {shortListings.length === 0 ? (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>All Clear!</AlertTitle>
            <AlertDescription>All listings have proper descriptions.</AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="border-orange-500 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle>SEO Issue Detected</AlertTitle>
              <AlertDescription>
                {shortListings.length} listings have descriptions under 150 characters, which hurts SEO and user experience.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleFixAll}
                disabled={isFixing}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isFixing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fixing {progress.current}/{progress.total}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Fix All {shortListings.length} Descriptions
                  </>
                )}
              </Button>

              <Button
                onClick={selectAll}
                variant="outline"
                disabled={isFixing}
              >
                Select All
              </Button>

              <Button
                onClick={deselectAll}
                variant="outline"
                disabled={isFixing}
              >
                Deselect All
              </Button>

              {selectedIds.length > 0 && (
                <Button
                  onClick={handleFixSelected}
                  disabled={isFixing}
                  variant="secondary"
                >
                  Fix Selected ({selectedIds.length})
                </Button>
              )}
            </div>

            {isFixing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Progress: {progress.current} / {progress.total}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <Progress value={(progress.current / progress.total) * 100} className="h-2" />
              </div>
            )}

            <div className="space-y-3 max-h-[600px] overflow-y-auto border rounded-lg p-4">
              {shortListings.map(listing => (
                <div
                  key={listing.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedIds.includes(listing.id) ? 'bg-blue-50 border-blue-300' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(listing.id)}
                      onChange={() => toggleSelection(listing.id)}
                      disabled={isFixing}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">{listing.name}</h4>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">{listing.category}</Badge>
                          <Badge variant="outline" className="text-xs">{listing.chain}</Badge>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500">Current ({listing.description?.length || 0} chars):</span>
                        <p className="text-slate-600 mt-1 italic">
                          {listing.description || '(No description)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
