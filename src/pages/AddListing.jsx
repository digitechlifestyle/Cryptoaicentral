
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AddListingPage() {
  const [schema, setSchema] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: '',
    description: '',
    website: '',
    tags: [],
    chain: '',
    chain_type: '',
    pricing: '',
    risk: 'Medium',
    kyc_required: 'No',
    tier: 'basic',
    banner_type: 'none',
    affiliate_link: '',
    referral_code: '',
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const entitySchema = await base44.entities.DirectoryListing.schema();
        setSchema(entitySchema);
      } catch (error) {
        console.error('Failed to load schema:', error);
        setError('Failed to load form schema. Please try again later.');
      }
    };

    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
        base44.auth.redirectToLogin(window.location.href);
      }
    };
    
    loadSchema();
    checkUser();

    const urlParams = new URLSearchParams(window.location.search);
    const tierParam = urlParams.get('tier');
    if (tierParam && ['basic', 'featured', 'sponsored', 'leaderboard_banner', 'rectangle_banner', 'mobile_banner', 'vertical_banner'].includes(tierParam)) {
      setFormData(prev => ({ 
        ...prev, 
        tier: tierParam,
        banner_type: tierParam.includes('banner') ? tierParam.replace('_banner', '') : 'none'
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMultiSelectChange = (name, value) => {
    // For now, handling tags as comma separated string
    setFormData(prev => ({...prev, [name]: value.split(',').map(s => s.trim())}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.name || !formData.category || !formData.website || !formData.description) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // No longer need to validate banner_image_url from user
    
    // Auto-assign featured/sponsored based on tier
    const submissionData = {
        ...formData,
        featured: ['featured', 'sponsored'].includes(formData.tier),
        sponsored: formData.tier === 'sponsored',
    };

    try {
      await base44.entities.DirectoryListing.create(submissionData);

      // Check for and process referral
      const referralCode = localStorage.getItem('referralCode');
      if (referralCode) {
        const affiliates = await base44.entities.Affiliate.filter({ referral_code: referralCode, status: 'active' });
        if (affiliates.length > 0) {
          const affiliate = affiliates[0];
          // Increment signups and earnings
          const updatedSignups = (affiliate.signups || 0) + 1;
          const updatedEarnings = (affiliate.earnings || 0) + 2.50; // Example commission for a listing
          await base44.entities.Affiliate.update(affiliate.id, {
            signups: updatedSignups,
            earnings: updatedEarnings
          });
          // Clear referral code after use
          localStorage.removeItem('referralCode');
        }
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !schema) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4 text-lg">{!user ? 'Redirecting to login...' : 'Loading form...'}</p>
        </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <Alert className="text-left">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Submission Received!</AlertTitle>
          <AlertDescription>
            Thank you for submitting your project. Our team will review it shortly. You will be notified once the review is complete. If you chose a paid tier, we will reach out to you regarding payment.
          </AlertDescription>
        </Alert>
        <Link to={createPageUrl('Home')}>
            <Button variant="outline" className="mt-8">Back to Homepage</Button>
        </Link>
      </div>
    );
  }

  const getTierDisplayName = (tier) => {
    const names = {
      basic: 'Basic',
      featured: 'Featured', 
      sponsored: 'Sponsored',
      leaderboard_banner: 'Leaderboard Banner',
      rectangle_banner: 'Rectangle Banner',
      mobile_banner: 'Mobile Banner',
      vertical_banner: 'Vertical Banner'
    };
    return names[tier] || tier;
  };

  const getBannerSize = (tier) => {
    const sizes = {
      leaderboard_banner: '728x90 pixels',
      rectangle_banner: '300x250 pixels',
      mobile_banner: '320x50 pixels',
      vertical_banner: '300x600 pixels'
    };
    return sizes[tier] || 'N/A';
  }

  const isBannerTier = formData.tier.includes('banner');

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-2">Submit a Project</h1>
      <p className="text-slate-600 mb-8">
        Fill out the form below to add your project to our directory. All submissions are reviewed by our team.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tier Information */}
        <div className={`p-4 border rounded-lg ${isBannerTier ? 'bg-indigo-50 border-indigo-200' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className={`font-semibold text-lg ${isBannerTier ? 'text-indigo-900' : 'text-blue-900'}`}>
                You are submitting for the {getTierDisplayName(formData.tier)} tier.
            </h3>
            {isBannerTier && (
              <>
                <p className="text-indigo-700 text-sm mt-1">
                    Banner ads require approval. Our team will contact you after submission to handle payment and upload your banner creative.
                </p>
                <p className="font-semibold text-indigo-800 text-sm mt-2">Required Banner Size: {getBannerSize(formData.tier)}</p>
              </>
            )}
            <p className={`${isBannerTier ? 'text-indigo-700' : 'text-blue-700'} text-sm`}>
                To change your plan, please visit our <Link to={createPageUrl("Pricing")} className="underline">pricing page</Link>.
            </p>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
              <Input name="website" type="url" value={formData.website} onChange={handleChange} required />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Affiliate/Referral Link (Optional)</label>
              <Input name="affiliate_link" type="url" value={formData.affiliate_link} onChange={handleChange} placeholder="e.g., https://example.com/?ref=123" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Referral Code (Optional)</label>
              <Input name="referral_code" value={formData.referral_code} onChange={handleChange} placeholder="e.g., SIGNUP20" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <Textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <Select name="category" onValueChange={(v) => handleSelectChange('category', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                    <SelectContent>
                        {schema.properties.category.enum.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <Select name="type" onValueChange={(v) => handleSelectChange('type', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select a type..." /></SelectTrigger>
                    <SelectContent>
                        {schema.properties.type.enum.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        <SelectItem key="staking-platform" value="Staking Platform">Staking Platform</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Chain</label>
                <Select name="chain" onValueChange={(v) => handleSelectChange('chain', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select a chain..." /></SelectTrigger>
                    <SelectContent>
                        {schema.properties.chain.enum.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated, max 3)</label>
            <Input name="tags" onChange={(e) => handleMultiSelectChange('tags', e.target.value)} />
        </div>
        
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit for Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}
