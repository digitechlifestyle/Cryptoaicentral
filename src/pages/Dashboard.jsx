
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, DollarSign, Users, MousePointerClick, ExternalLink, CheckCircle, AlertCircle, Loader2, Mail, Zap, Sparkles, Key, CreditCard, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AIToolsPanel from "../components/affiliate/AIToolsPanel";
import EmailMarketingPanel from "../components/affiliate/EmailMarketingPanel";
import AutoresponderPanel from "../components/affiliate/AutoresponderPanel";
import APIKeysPanel from "../components/affiliate/APIKeysPanel";
import PaymentSubmission from "../components/affiliate/PaymentSubmission";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Helper function to generate unique referral code
const generateReferralCode = (email) => {
  const namePart = email.split('@')[0].toUpperCase().substring(0, 4);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePart}${randomPart}`;
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUserData();
    
    // Check URL params for tab and payment success
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const paymentParam = urlParams.get('payment');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    // If coming from successful payment, auto-create affiliate account
    if (paymentParam === 'success') {
      handlePaymentSuccess();
    }
  }, []);

  const handlePaymentSuccess = async () => {
    // Wait a moment for user to be loaded
    setTimeout(async () => {
      try {
        const userData = await base44.auth.me();
        
        // Check if affiliate already exists
        const existingAffiliate = await base44.entities.Affiliate.filter({ user_email: userData.email });
        
        if (existingAffiliate.length === 0) {
          // Create new affiliate account
          const referralCode = generateReferralCode(userData.email);
          await base44.entities.Affiliate.create({
            user_id: userData.id,
            user_email: userData.email,
            referral_code: referralCode,
            status: 'pending_payment',
            clicks: 0,
            signups: 0,
            earnings: 0
          });
          
          // Reload data to show new affiliate account
          await loadUserData();
        }
      } catch (error) {
        console.error("Failed to create affiliate account:", error);
      }
    }, 1000);
  };

  const loadUserData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      // Check if user is admin - admins get auto-affiliate access
      const isAdmin = userData.role === 'admin';

      // Check if user is an affiliate
      let affiliateData = await base44.entities.Affiliate.filter({ user_email: userData.email });
      
      if (affiliateData.length > 0) {
        setAffiliate(affiliateData[0]);
      } else if (isAdmin) {
        // Auto-create affiliate for admin if doesn't exist
        const referralCode = generateReferralCode(userData.email);
        
        try {
          const newAffiliate = await base44.entities.Affiliate.create({
            user_id: userData.id,
            user_email: userData.email,
            referral_code: referralCode,
            status: 'active', // Admin starts active
            clicks: 0,
            signups: 0,
            earnings: 0
          });
          
          setAffiliate(newAffiliate);
        } catch (error) {
          console.error("Failed to create admin affiliate:", error);
        }
      } else {
        // Check if user just came from affiliate program page
        const urlParams = new URLSearchParams(window.location.search);
        const fromAffiliate = urlParams.get('from_affiliate');
        
        if (fromAffiliate === 'true') {
          // Auto-create affiliate account with pending payment status
          const referralCode = generateReferralCode(userData.email);
          
          try {
            const newAffiliate = await base44.entities.Affiliate.create({
              user_id: userData.id,
              user_email: userData.email,
              referral_code: referralCode,
              status: 'pending_payment',
              clicks: 0,
              signups: 0,
              earnings: 0
            });
            
            setAffiliate(newAffiliate);
          } catch (error) {
            console.error("Failed to create affiliate:", error);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      // Redirect to login if not authenticated
      await base44.auth.redirectToLogin(window.location.href);
    }
    setIsLoading(false);
  };

  const generateReferralLink = () => {
    if (!affiliate?.referral_code) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/?ref=${affiliate.referral_code}`;
  };

  const copyReferralLink = () => {
    const link = generateReferralLink();
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If user is NOT an affiliate, show sign-up prompt
  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-blue-500 bg-blue-50 mb-6">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800 font-bold">Join Our Affiliate Program</AlertTitle>
            <AlertDescription className="text-blue-700">
              You're not enrolled as an affiliate yet. Join now to earn 50% commissions and get access to premium AI marketing tools!
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Become an Affiliate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">💰 Earn Money</h3>
                  <p className="text-sm text-green-700">Get 50% commission on every referral</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-800 mb-2">🤖 AI Tools</h3>
                  <p className="text-sm text-purple-700">Access premium marketing automation</p>
                </div>
              </div>

              <Link to={createPageUrl("AffiliateProgram")}>
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Join Affiliate Program
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show cancelled status
  if (affiliate.status === 'cancelled') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800 font-bold">Account Cancelled</AlertTitle>
            <AlertDescription className="text-red-700">
              Your affiliate account has been cancelled. Contact support if you believe this is an error.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Active or pending payment affiliate - show full dashboard
  const referralLink = generateReferralLink();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Affiliate Dashboard</h1>
            <p className="text-slate-600">
              Status: <Badge variant={affiliate.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                {affiliate.status === 'active' ? '✅ Active' : '⏳ Pending Payment'}
              </Badge>
            </p>
          </div>
        </div>

        {affiliate.status === 'pending_payment' && (
          <Alert className="mb-6 border-orange-500 bg-orange-50">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <AlertTitle className="text-orange-800 font-bold">Payment Required</AlertTitle>
            <AlertDescription className="text-orange-700">
              Submit your payment proof below to activate your affiliate account and unlock all features including AI tools, email marketing, and autoresponders.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {affiliate.status === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(affiliate.earnings || 0).toFixed(2)}</div>
                <p className="text-xs text-slate-500 mt-1">50% commission rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Signups</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{affiliate.signups || 0}</div>
                <p className="text-xs text-slate-500 mt-1">Total referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{affiliate.clicks || 0}</div>
                <p className="text-xs text-slate-500 mt-1">Link clicks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-600">Active</Badge>
                <p className="text-xs text-slate-500 mt-1">Account verified</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="overview">
              <DollarSign className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="emails">
              <Mail className="w-4 h-4 mr-2" />
              Email Marketing
            </TabsTrigger>
            <TabsTrigger value="autoresponder">
              <Zap className="w-4 h-4 mr-2" />
              Autoresponders
            </TabsTrigger>
            <TabsTrigger value="ai-tools">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Tools
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                  <Button onClick={copyReferralLink}>
                    {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-sm text-slate-600">
                  Share this link to earn 50% commission on every signup!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Share Your Link</h4>
                    <p className="text-sm text-slate-600">Promote your referral link on social media, email, or your website</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Users Sign Up</h4>
                    <p className="text-sm text-slate-600">When someone uses your link and signs up, we track it automatically</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Earn 50% Commission</h4>
                    <p className="text-sm text-slate-600">Get paid recurring commissions on all their purchases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails">
            <EmailMarketingPanel affiliate={affiliate} />
          </TabsContent>

          <TabsContent value="autoresponder">
            <AutoresponderPanel affiliate={affiliate} />
          </TabsContent>

          <TabsContent value="ai-tools">
            <AIToolsPanel affiliate={affiliate} />
          </TabsContent>

          <TabsContent value="api-keys">
            <APIKeysPanel affiliate={affiliate} />
          </TabsContent>

          <TabsContent value="payment">
            <div className="space-y-6">
              <PaymentSubmission affiliate={affiliate} onPaymentSubmitted={loadUserData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
