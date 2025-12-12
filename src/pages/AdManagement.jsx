import React, { useState, useEffect, useCallback } from 'react';
import { DirectoryListing } from '@/api/entities';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Plus, Trash2, Eye } from 'lucide-react';

export default function AdManagementPage() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newAd, setNewAd] = useState({
    name: '',
    website: '',
    banner_type: 'leaderboard',
    banner_image_url: ''
  });

  const loadAds = useCallback(async () => {
    try {
      const bannerAds = await DirectoryListing.filter({
        status: 'approved',
        banner_type: { $ne: 'none' }
      });
      setAds(bannerAds);
    } catch (error) {
      console.error('Failed to load ads:', error);
    }
  }, []);

  const checkAdminAndLoadAds = useCallback(async () => {
    try {
      const user = await User.me();
      if (user && user.role === 'admin') {
        setIsAdmin(true);
        await loadAds();
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
    }
    setIsLoading(false);
  }, [loadAds]);

  useEffect(() => {
    checkAdminAndLoadAds();
  }, [checkAdminAndLoadAds]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setNewAd(prev => ({ ...prev, banner_image_url: file_url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
    setIsUploading(false);
  };

  const handleCreateAd = async (e) => {
    e.preventDefault();
    if (!newAd.name || !newAd.website || !newAd.banner_image_url) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    try {
      await DirectoryListing.create({
        ...newAd,
        category: 'Advertisement',
        type: 'Banner Ad',
        description: `Banner advertisement for ${newAd.name}`,
        chain: 'Off-chain',
        chain_type: '-',
        pricing: 'Custom',
        risk: 'Low',
        kyc_required: 'No',
        status: 'approved',
        tier: `${newAd.banner_type}_banner`
      });

      setNewAd({
        name: '',
        website: '',
        banner_type: 'leaderboard',
        banner_image_url: ''
      });

      await loadAds();
      alert('Advertisement created successfully!');
    } catch (error) {
      console.error('Failed to create ad:', error);
      alert('Failed to create advertisement. Please try again.');
    }
  };

  const handleDeleteAd = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the ad for "${name}"?`)) {
      try {
        await DirectoryListing.delete(id);
        await loadAds();
      } catch (error) {
        console.error('Failed to delete ad:', error);
        alert('Failed to delete advertisement. Please try again.');
      }
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Advertisement Management</h1>
        <p className="text-slate-600">Manage banner advertisements across your site</p>
      </div>

      {/* Add New Ad */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Advertisement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Advertiser Name"
                value={newAd.name}
                onChange={(e) => setNewAd(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Website URL"
                type="url"
                value={newAd.website}
                onChange={(e) => setNewAd(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <Select value={newAd.banner_type} onValueChange={(value) => setNewAd(prev => ({ ...prev, banner_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select banner type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leaderboard">Leaderboard (728x90)</SelectItem>
                <SelectItem value="rectangle">Rectangle (300x250)</SelectItem>
                <SelectItem value="vertical">Vertical (300x600)</SelectItem>
                <SelectItem value="mobile">Mobile (320x50)</SelectItem>
              </SelectContent>
            </Select>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              {newAd.banner_image_url ? (
                <div>
                  <img 
                    src={newAd.banner_image_url} 
                    alt="Banner preview" 
                    className="max-w-full max-h-32 mx-auto mb-4 rounded border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewAd(prev => ({ ...prev, banner_image_url: '' }))}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Upload banner image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label htmlFor="banner-upload">
                    <Button type="button" variant="outline" disabled={isUploading} asChild>
                      <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Advertisement
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Ads */}
      <Card>
        <CardHeader>
          <CardTitle>Current Advertisements ({ads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <p className="text-center py-8 text-slate-500">No advertisements found.</p>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {ad.banner_image_url && (
                      <img 
                        src={ad.banner_image_url} 
                        alt={`${ad.name} banner`} 
                        className="w-20 h-12 object-cover rounded border"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{ad.name}</h3>
                      <p className="text-sm text-slate-600">{ad.banner_type} • {ad.website}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(ad.website, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAd(ad.id, ad.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Google AdSense Instructions */}
      <Alert className="mt-8">
        <AlertDescription>
          <strong>Google AdSense Setup:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Apply for Google AdSense at <a href="https://www.google.com/adsense/" target="_blank" className="text-blue-600 underline">google.com/adsense</a></li>
            <li>Once approved, replace "ca-pub-YOUR_PUBLISHER_ID" in your layout with your actual Publisher ID</li>
            <li>Create ad units in AdSense and use the ad slot IDs in your GoogleAd components</li>
            <li>Google ads will automatically appear alongside your banner ads for maximum revenue</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}