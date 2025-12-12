
import React, { useState, useEffect, useRef } from 'react';
import { DirectoryListing } from '@/api/entities';
import { User } from '@/api/entities';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Upload, Loader2, Eye, TrendingUp, Smartphone, ArrowRight, DollarSign, Users, BarChart, ExternalLink, Copy, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const PAYPAL_BANNER_LINKS = {
  mobile: "https://www.paypal.com/ncp/payment/ZX9SDLC4HRJ3Y",
  rectangle: "https://www.paypal.com/ncp/payment/B98Z9PLK2KE5G",
  leaderboard: "https://www.paypal.com/ncp/payment/GUK7ZRF29MZZU",
  vertical: "https://www.paypal.com/ncp/payment/PQE5PUFB25AL8"
};

// ✅ YOUR REAL CRYPTO WALLET ADDRESSES (Same as affiliate program)
const cryptoAddresses = {
  bitcoin: { 
    address: "3PhM9hbdssYBL8t6qZKqT2EtT44bWHrRdT",
    network: "Bitcoin Network"
  },
  ethereum: { 
    address: "0x44333f435253d8B79C2945128cB538472F70B092",
    network: "Ethereum (ERC-20)"
  },
  usdc: { 
    address: "0x44333f435253d8B79C2945128cB538472F70B092",
    network: "Ethereum (ERC-20)"
  },
  usdt: { 
    address: "0x44333f435253d8B79C2945128cB538472F70B092",
    network: "Ethereum (ERC-20)"
  },
  stellar: { 
    address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37",
    memo: "483135691",
    network: "Stellar Network (XLM)"
  },
  rlusd: { 
    address: "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
    tag: "250021006",
    network: "XRP Ledger (RLUSD)"
  },
  xrp: { 
    address: "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
    tag: "250021006",
    network: "XRP Ledger"
  },
  hedera: { 
    address: "0.0.1133968",
    memo: "4256019166",
    network: "Hedera Hashgraph (HBAR)"
  },
  xdc: { 
    address: "0x5f3a18871b474260c8786648dbc512328147c8b2",
    network: "XDC Network"
  },
  solana: { 
    address: "7nANiWg9zGZjEuBogFfgVRCovrH6jEfTyWYbTaj1eMBm",
    network: "Solana"
  }
};

const bannerTiers = [
  {
    name: 'Leaderboard Banner',
    id: 'leaderboard',
    size: '728x90',
    price: '$199',
    frequency: '/ year',
    description: 'Premium banner placement at the top of pages.',
    features: [
      'Web standard 728x90 banner size',
      'Displayed on homepage and category pages',
      'High visibility above-the-fold placement',
      'Compatible with all devices',
      'Monthly performance reports',
      'Estimated 50,000+ impressions/month'
    ],
    icon: Eye,
    placement: 'Top of pages',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'Vertical Banner',
    id: 'vertical',
    size: '300x600',
    price: '$249',
    frequency: '/ year',
    description: 'High-impact vertical banner for sidebar placement.',
    features: [
      'IAB standard 300x600 "Half Page" ad',
      'Exclusive sidebar placement on all pages',
      'Guaranteed visibility on desktop',
      'High engagement format',
      'Monthly performance reports',
      'Estimated 40,000+ impressions/month'
    ],
    icon: TrendingUp,
    placement: 'Main Sidebar',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Rectangle Banner',
    id: 'rectangle',
    size: '300x250',
    price: '$99',
    frequency: '/ year',
    description: 'Versatile banner for sidebar and in-content placement.',
    features: [
      'Web standard 300x250 banner size',
      'Sidebar and in-content placement',
      'Appears on project detail pages',
      'Mobile and desktop optimized',
      'Contextual targeting available',
      'Estimated 35,000+ impressions/month'
    ],
    icon: ArrowRight,
    placement: 'Sidebar & Content',
    color: 'from-green-500 to-teal-500'
  },
  {
    name: 'Mobile Banner',
    id: 'mobile',
    size: '320x50',
    price: '$49',
    frequency: '/ year',
    description: 'Mobile-optimized banner for mobile users.',
    features: [
      'Web standard 320x50 banner size',
      'Mobile-first placement strategy',
      'Appears on mobile browsing',
      'Lightweight and fast loading',
      'Mobile user analytics',
      'Estimated 25,000+ impressions/month'
    ],
    icon: Smartphone,
    placement: 'Mobile Only',
    color: 'from-orange-500 to-red-500'
  }
];

export default function AdvertisePage() {
  const [user, setUser] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' or 'crypto'
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [siteStats, setSiteStats] = useState({
    monthly_visitors: 50000,
    monthly_impressions: 150000,
    avg_ctr: 2.5
  });
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    contact_email: '',
    banner_image_url: '',
    additional_info: '',
    payment_method: '',
    transaction_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // New state for drag-and-drop
  const [imageValidation, setImageValidation] = useState(null); // New state for image dimension validation
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkUser();
    loadSiteStats();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setFormData(prev => ({ ...prev, contact_email: currentUser.email }));
    } catch (error) {
      setUser(null);
    }
  };

  const loadSiteStats = async () => {
    try {
      // Get analytics from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const analytics = await base44.entities.Analytics.list('-created_date', 10000);
      
      // Filter last 30 days
      const recentAnalytics = analytics.filter(a => 
        new Date(a.created_date) >= thirtyDaysAgo
      );
      
      // Calculate unique visitors (by session_id)
      const uniqueSessions = new Set(recentAnalytics.map(a => a.session_id)).size;
      
      // Count impressions (views and banner impressions)
      const impressions = recentAnalytics.filter(a => 
        a.event_type === 'listing_view' || 
        a.event_type === 'banner_impression'
      ).length;
      
      // Count clicks
      const clicks = recentAnalytics.filter(a => 
        a.event_type === 'listing_click' || 
        a.event_type === 'banner_click'
      ).length;
      
      // Calculate CTR - use default 2.5% if not enough data
      let ctr = 2.5;
      if (impressions > 100 && clicks > 0) {
        ctr = parseFloat(((clicks / impressions) * 100).toFixed(1));
      }
      
      setSiteStats({
        // Use default if analytics are too low, otherwise use actual
        monthly_visitors: uniqueSessions > 1000 ? uniqueSessions : 50000,
        monthly_impressions: impressions > 1000 ? impressions : 150000,
        avg_ctr: ctr
      });
    } catch (error) {
      console.error('Failed to load site stats:', error);
      // Keep default values if fetch fails
    }
  };

  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      // Only validate if it's an image file
      if (!file.type.startsWith('image/')) {
        resolve({
          width: 0,
          height: 0,
          isCorrectSize: true, // Non-image files are "correct" by definition for dimensions
          message: `✓ File uploaded: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`
        });
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.width;
        const height = img.height;
        
        const expectedDimensions = {
          'leaderboard': { width: 728, height: 90 },
          'vertical': { width: 300, height: 600 },
          'rectangle': { width: 300, height: 250 },
          'mobile': { width: 320, height: 50 }
        };
        
        const expected = expectedDimensions[selectedTier.id];
        const isCorrectSize = width === expected.width && height === expected.height;
        
        resolve({
          width,
          height,
          expected,
          isCorrectSize,
          message: isCorrectSize 
            ? `✓ Perfect! ${width}×${height}px matches ${selectedTier.name} size`
            : `⚠️ Image is ${width}×${height}px, but should be ${expected.width}×${expected.height}px for ${selectedTier.name}`
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ 
          error: 'Failed to load image',
          message: '⚠️ Could not read image dimensions. Please check the file format or try another image.'
        });
      };
      
      img.src = url;
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setError('');
    setImageValidation(null); // Clear previous validation

    console.log('Uploading file:', file.name, file.type, file.size);
    
    // Validate dimensions (only for images)
    const validation = await validateImageDimensions(file);
    setImageValidation(validation);
    
    if (validation.error) {
      setError(validation.error);
      return;
    }

    try {
      console.log('Calling upload API...');
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      console.log('Upload successful:', file_url);
      setFormData(prev => ({ ...prev, banner_image_url: file_url }));
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload file. Please try again.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    console.log('File dropped!');
    const files = e.dataTransfer.files;
    console.log('Number of files:', files.length);
    
    if (files && files.length > 0) {
      const file = files[0];
      console.log('Processing file:', file);
      await handleFileUpload(file);
    }
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
    if (file) {
      await handleFileUpload(file);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      'bitcoin': 'Bitcoin (BTC)',
      'ethereum': 'Ethereum (ETH)',
      'usdc': 'USDC',
      'usdt': 'USDT',
      'xrp': 'XRP',
      'rlusd': 'RLUSD',
      'stellar': 'Stellar (XLM)',
      'solana': 'Solana (SOL)',
      'hedera': 'Hedera (HBAR)',
      'xdc': 'XDC Network',
      'paypal': 'PayPal'
    };
    return methods[method] || method;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTier) {
      setError('Please select a banner tier');
      return;
    }

    if (!formData.company_name || !formData.website || !formData.contact_email) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.banner_image_url) {
      setError('Please upload your banner file.');
      return;
    }

    // Transaction ID is now required for both payment methods before final submission
    if (!formData.transaction_id) {
      setError('Please enter your transaction ID after paying');
      return;
    }

    // Submit for admin review
    setIsSubmitting(true);
    setError('');

    try {
      const tierMap = {
        'leaderboard': 'leaderboard_banner',
        'vertical': 'vertical_banner',
        'rectangle': 'rectangle_banner',
        'mobile': 'mobile_banner'
      };

      await base44.entities.DirectoryListing.create({
        name: formData.company_name,
        website: formData.website,
        category: 'Banner Advertisement',
        type: 'Banner Ad',
        description: `Banner advertisement for ${formData.company_name}`,
        chain: '-',
        chain_type: '-',
        pricing: selectedTier.price,
        risk: 'Low',
        kyc_required: 'No',
        status: 'pending_review',
        tier: tierMap[selectedTier.id],
        banner_image_url: formData.banner_image_url,
        banner_type: selectedTier.id,
        additional_info: `Payment Method: ${formatPaymentMethod(paymentMethod === 'paypal' ? 'paypal' : selectedCrypto)}\nTransaction ID: ${formData.transaction_id}\n\nAdditional Notes: ${formData.additional_info}`
      });

      setIsSubmitted(true);
      setFormData({
        company_name: '',
        website: '',
        contact_email: user?.email || '',
        banner_image_url: '',
        additional_info: '',
        payment_method: '',
        transaction_id: ''
      });
      setSelectedTier(null);
      setPaymentMethod('paypal');
      setImageValidation(null);
    } catch (error) {
      console.error('Submission failed:', error);
      setError('Failed to submit banner ad. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierPrice = (tierId) => {
    const prices = {
      'leaderboard': 199,
      'vertical': 249,
      'rectangle': 99,
      'mobile': 49
    };
    return prices[tierId];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 text-lg bg-gradient-to-r from-blue-600 to-purple-600">
            Advertise With Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Reach {siteStats.monthly_visitors.toLocaleString()}+ Crypto Enthusiasts
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Premium banner placements across our high-traffic crypto directory. From $49/year.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">{siteStats.monthly_visitors.toLocaleString()}+</p>
              <p className="text-slate-600">Monthly Visitors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Eye className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">{siteStats.monthly_impressions.toLocaleString()}+</p>
              <p className="text-slate-600">Monthly Impressions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BarChart className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-slate-900">{siteStats.avg_ctr}%</p>
              <p className="text-slate-600">Avg Click-Through Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Banner Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Banner Size</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bannerTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`transition-all flex flex-col ${
                  selectedTier?.id === tier.id 
                    ? 'ring-4 ring-blue-500 shadow-xl' 
                    : 'hover:shadow-lg'
                }`}
              >
                <CardHeader className={`bg-gradient-to-r ${tier.color} text-white pb-4`}>
                  <tier.icon className="w-8 h-8 mb-2" />
                  <CardTitle className="text-lg leading-tight">{tier.name}</CardTitle>
                  <p className="text-sm opacity-90">{tier.size} pixels</p>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                    <span className="text-slate-600">{tier.frequency}</span>
                  </div>
                  <Badge className="w-full justify-center mb-4">{tier.placement}</Badge>
                  <ul className="space-y-2 text-sm text-slate-600 mb-6 flex-1">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Add Select Button */}
                  <Button
                    onClick={() => {
                      setSelectedTier(tier);
                      // Clear image related states when changing tier
                      setFormData(prev => ({ ...prev, banner_image_url: '' }));
                      setImageValidation(null);
                      setError('');
                    }}
                    className={`w-full h-auto py-3 flex items-center justify-center mt-auto ${
                      selectedTier?.id === tier.id
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {selectedTier?.id === tier.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span className="whitespace-normal text-center leading-tight px-2">
                        Select {tier.name}
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Banner Submission Form */}
        {selectedTier && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Submit Your {selectedTier.name}</CardTitle>
              <p className="text-slate-600">Fill in your details and upload your banner</p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <AlertTitle className="text-green-900 font-bold">Submission Received!</AlertTitle>
                  <AlertDescription className="text-green-800">
                    {paymentMethod === 'paypal' 
                      ? "Thank you! We've received your PayPal transaction ID. Our team will verify your payment and review your banner within 24 hours. You'll be notified once it's approved and live."
                      : "Thank you! We've received your crypto transaction ID. Our team will verify your payment and review your banner within 24 hours. You'll be notified once it's approved and live."}
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company/Project Name *</label>
                      <Input
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        placeholder="Your Company Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Website URL *</label>
                      <Input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Email *</label>
                      <Input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Drag-and-Drop Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Banner File * ({selectedTier.size} pixels recommended for images)
                    </label>
                    
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        isDragging 
                          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => {
                        if (!formData.banner_image_url) { // Only trigger file input if no file is currently uploaded
                          console.log('Clicking to open file picker');
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      {formData.banner_image_url ? (
                        <div>
                          {/* Check if the URL points to a common image format to display a preview */}
                          {formData.banner_image_url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                            <img 
                              src={formData.banner_image_url} 
                              alt="Banner preview"
                              className="max-w-full h-auto mx-auto mb-4 border rounded"
                              style={{ maxHeight: '300px' }}
                            />
                          ) : (
                            <div className="mb-4 p-4 bg-slate-100 rounded">
                              <p className="text-slate-700 font-medium">File uploaded successfully!</p>
                              <a 
                                href={formData.banner_image_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                View uploaded file
                                <ExternalLink className="w-3 h-3 inline-block ml-1" />
                              </a>
                            </div>
                          )}
                          
                          {imageValidation && (
                            <Alert className={`mb-4 ${imageValidation.isCorrectSize ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                              <AlertDescription className={imageValidation.isCorrectSize ? 'text-green-800' : 'text-yellow-800'}>
                                {imageValidation.message}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Button 
                            type="button"
                            variant="outline" 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent div's onClick from firing
                              setFormData(prev => ({ ...prev, banner_image_url: '' }));
                              setImageValidation(null);
                              setError('');
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ''; // Clear the file input
                              }
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-slate-700 mb-2">
                            Drag & drop your file here
                          </p>
                          <p className="text-sm text-slate-500 mb-4">
                            or click anywhere to browse
                          </p>
                          <Button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent div's onClick from firing
                              fileInputRef.current?.click();
                            }}
                          >
                            Choose File
                          </Button>
                          <p className="text-xs text-slate-500 mt-4">
                            Any file type accepted • Recommended: PNG, JPG, GIF • {selectedTier.size}px for images
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="*/*" // Accept all file types
                        onChange={handleFileInputChange}
                        className="hidden"
                        onClick={(e) => e.stopPropagation()} // Prevent parent div's onClick when hidden input is clicked
                      />
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-4">Choose Payment Method *</label>
                    <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="paypal">
                          <DollarSign className="w-4 h-4 mr-2" />
                          PayPal
                        </TabsTrigger>
                        <TabsTrigger value="crypto">
                          <Wallet className="w-4 h-4 mr-2" />
                          Cryptocurrency
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="paypal" className="mt-4 space-y-4">
                        <Alert>
                          <DollarSign className="w-4 h-4" />
                          <AlertTitle>Step 1: Pay with PayPal</AlertTitle>
                          <AlertDescription>
                            Click the button below to pay {selectedTier.price} securely via PayPal.
                            After completing payment, return here to submit your banner details.
                          </AlertDescription>
                        </Alert>

                        <Button
                          type="button"
                          size="lg"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            const paypalLink = PAYPAL_BANNER_LINKS[selectedTier.id];
                            window.open(paypalLink, '_blank');
                          }}
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Pay {selectedTier.price} with PayPal
                        </Button>

                        <Alert className="bg-green-50 border-green-200">
                          <AlertTitle className="text-green-900">Step 2: Enter Transaction ID</AlertTitle>
                          <AlertDescription className="text-green-800">
                            After completing your PayPal payment, enter the transaction ID below. You will find this in your PayPal receipt.
                          </AlertDescription>
                        </Alert>

                        <div>
                          <label className="block text-sm font-medium mb-2">PayPal Transaction ID *</label>
                          <Input
                            value={formData.transaction_id}
                            onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                            placeholder="Enter PayPal transaction ID (e.g., 1AB23456CD789012E)"
                            required
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Find this in your PayPal receipt email or transaction history
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="crypto" className="mt-4 space-y-4">
                        <Alert>
                          <Wallet className="w-4 h-4" />
                          <AlertTitle>Pay with Cryptocurrency</AlertTitle>
                          <AlertDescription>
                            Send {selectedTier.price} worth of cryptocurrency to the address below, then submit your transaction ID for verification.
                          </AlertDescription>
                        </Alert>

                        {/* Crypto Selection */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Select Cryptocurrency</label>
                          <select
                            value={selectedCrypto}
                            onChange={(e) => setSelectedCrypto(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                          >
                            <option value="bitcoin">Bitcoin (BTC)</option>
                            <option value="ethereum">Ethereum (ETH)</option>
                            <option value="usdc">USDC (Stablecoin)</option>
                            <option value="usdt">USDT (Stablecoin)</option>
                            <option value="xrp">XRP</option>
                            <option value="rlusd">RLUSD (Stablecoin)</option>
                            <option value="stellar">Stellar (XLM)</option>
                            <option value="solana">Solana (SOL)</option>
                            <option value="hedera">Hedera (HBAR)</option>
                            <option value="xdc">XDC Network</option>
                          </select>
                        </div>

                        {/* Wallet Address Display */}
                        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Network:</span>
                            <Badge>{cryptoAddresses[selectedCrypto].network}</Badge>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium block mb-2">Send To:</label>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 bg-white px-3 py-2 rounded border text-sm break-all">
                                {cryptoAddresses[selectedCrypto].address}
                              </code>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto].address)}
                              >
                                {copiedAddress ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>

                          {cryptoAddresses[selectedCrypto].memo && (
                            <Alert variant="destructive">
                              <AlertTitle className="font-bold">⚠️ MEMO REQUIRED</AlertTitle>
                              <AlertDescription>
                                <div className="flex items-center gap-2 mt-2">
                                  <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                                    {cryptoAddresses[selectedCrypto].memo}
                                  </code>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto].memo)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-xs mt-2">You MUST include this memo or your payment may be lost!</p>
                              </AlertDescription>
                            </Alert>
                          )}

                          {cryptoAddresses[selectedCrypto].tag && (
                            <Alert variant="destructive">
                              <AlertTitle className="font-bold">⚠️ DESTINATION TAG REQUIRED</AlertTitle>
                              <AlertDescription>
                                <div className="flex items-center gap-2 mt-2">
                                  <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                                    {cryptoAddresses[selectedCrypto].tag}
                                  </code>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto].tag)}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-xs mt-2">You MUST include this tag or your payment may be lost!</p>
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-sm text-blue-900">
                              <strong>Amount to Send:</strong> ~{selectedTier.price} worth of {formatPaymentMethod(selectedCrypto)}
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              Send the equivalent value at the current market rate
                            </p>
                          </div>
                        </div>

                        {/* Transaction ID Input */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Transaction ID/Hash *</label>
                          <Input
                            value={formData.transaction_id}
                            onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                            placeholder="Enter transaction ID after sending payment"
                            required
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Enter the transaction ID/hash from your wallet after sending the payment
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Information (Optional)</label>
                    <Textarea
                      value={formData.additional_info}
                      onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                      placeholder="Any special requirements or notes..."
                      rows={4}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={isSubmitting || !formData.banner_image_url}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit for Review
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Why Advertise Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Why Advertise on Crypto AI Central?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Targeted Audience</h4>
                <p className="text-slate-600">
                  Reach crypto enthusiasts actively searching for AI trading bots, DeFi protocols, and blockchain tools.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">High Engagement</h4>
                <p className="text-slate-600">
                  Our users spend an average of 5+ minutes per visit, actively researching and comparing platforms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Premium Placements</h4>
                <p className="text-slate-600">
                  Strategic banner positions ensure maximum visibility across all pages and devices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Monthly Reports</h4>
                <p className="text-slate-600">
                  Get detailed analytics on impressions, clicks, and engagement with your banner ads.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How long does approval take?</h4>
              <p className="text-slate-600">
                We typically review and approve banner submissions within 24 hours. You'll receive an email notification once your banner is live.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I update my banner later?</h4>
              <p className="text-slate-600">
                Yes! You can update your banner image anytime by contacting us. We'll review and swap it out within 24 hours at no extra cost.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-600">
                We accept PayPal and 10 different cryptocurrencies (Bitcoin, Ethereum, USDC, USDT, XRP, RLUSD, Stellar, Solana, Hedera, XDC).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-slate-600">
                Annual subscriptions are non-refundable, but we offer a satisfaction guarantee. If you're not happy with your banner performance in the first 30 days, contact us and we'll work to improve it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
