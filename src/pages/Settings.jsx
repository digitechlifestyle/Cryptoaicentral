
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { SiteSettings } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings as SettingsIcon,
  Zap,
  Database,
  Code,
  ExternalLink,
  Info,
  CheckCircle,
  CreditCard,
  Save,
  Copy,
  Check,
  DollarSign // Added DollarSign icon
} from 'lucide-react';
import StripeIntegrationDocs from '../components/admin/StripeIntegrationDocs';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState(null);
  const [stripeKey, setStripeKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  // Removed showDocs state, as documentation will be always visible

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsAdmin(currentUser.role === 'admin');

      if (currentUser.role === 'admin') {
        const existingSettings = await SiteSettings.list();
        if (existingSettings.length > 0) {
          setSettings(existingSettings[0]);
          setStripeKey(existingSettings[0].stripe_publishable_key || '');
        } else {
          // If no settings exist, initialize with an empty object for reactivity
          setSettings({});
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setIsLoading(false);
  };

  const handleSaveStripeKey = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      if (settings && settings.id) {
        await SiteSettings.update(settings.id, { stripe_publishable_key: stripeKey });
      } else {
        await SiteSettings.create({ stripe_publishable_key: stripeKey });
      }
      setSaveSuccess(true);
      await loadData(); // Reload all settings to reflect changes
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save Stripe key:', error);
      alert('Failed to save settings. Please try again.');
    }
    setIsSaving(false);
  };

  const backendFunctionCode = `/**
 * Stripe Checkout for Affiliate Subscriptions
 * 
 * Environment variables needed:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_... or sk_live_...)
 * - APP_URL: Your app URL (e.g., https://your-app.base44.app)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const { httpMethod, body, path } = event;

  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Create checkout session
  if (httpMethod === 'POST' && path.includes('/create-session')) {
    try {
      const data = JSON.parse(body);
      const { affiliateId, userEmail, plan = 'monthly' } = data;

      if (!affiliateId || !userEmail) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing required fields' })
        };
      }

      const priceData = plan === 'annual' ? {
        currency: 'usd',
        product_data: {
          name: 'CryptoAI Central - Annual Affiliate Subscription',
          description: 'Access to affiliate program with 10% commission'
        },
        unit_amount: 19999,
        recurring: { interval: 'year' }
      } : {
        currency: 'usd',
        product_data: {
          name: 'CryptoAI Central - Monthly Affiliate Subscription',
          description: 'Access to affiliate program with 10% commission'
        },
        unit_amount: 1999,
        recurring: { interval: 'month' }
      };

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price_data: priceData, quantity: 1 }],
        mode: 'subscription',
        success_url: process.env.APP_URL + '/Dashboard?tab=affiliate&payment=success',
        cancel_url: process.env.APP_URL + '/AffiliateProgram?payment=cancelled',
        customer_email: userEmail,
        client_reference_id: affiliateId,
        metadata: { affiliateId, userEmail, plan }
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ sessionId: session.id, url: session.url })
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  return {
    statusCode: 404,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Not found' })
  };
};`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(backendFunctionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const features = [
    {
      name: 'Database Access',
      description: 'Direct database access for advanced queries',
      icon: Database,
      status: 'active',
      benefits: [
        'Entity CRUD operations',
        'Filtering and sorting',
        'Real-time updates',
        'Row-level security'
      ]
    },
    {
      name: 'AI Integrations',
      description: 'Built-in AI capabilities via Core integrations',
      icon: Zap,
      status: 'active',
      benefits: [
        'InvokeLLM for text generation',
        'GenerateImage for AI images',
        'ExtractDataFromUploadedFile',
        'SendEmail automation'
      ]
    },
    {
      name: 'Stripe Payments',
      description: 'Accept credit card and debit card payments',
      icon: CreditCard,
      status: settings?.stripe_publishable_key ? 'configured' : 'requires_setup',
      benefits: [
        'Credit/debit card processing',
        'Subscription billing',
        'One-time payments',
        'Customer portal',
        'Automatic invoicing'
      ]
    },
    {
      name: 'Backend Functions',
      description: 'Create custom serverless functions for advanced integrations',
      icon: Code,
      status: 'active',
      benefits: [
        'Custom API endpoints',
        'Third-party API integrations',
        'Advanced data processing',
        'Scheduled jobs and cron tasks',
        'Custom payment processors'
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-slate-600">Manage your app configuration and features</p>
        </div>

        {/* User Info */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Name:</span>
                <span className="font-semibold">{user.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Email:</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Role:</span>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Google AdSense Configuration */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Google AdSense Configuration
              </CardTitle>
              <CardDescription>
                Configure your Google AdSense Publisher ID for ad monetization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adsense-id">Google AdSense Publisher ID</Label>
                <Input
                  id="adsense-id"
                  value={settings?.google_adsense_publisher_id || ''}
                  onChange={(e) => {
                    if (settings) {
                      setSettings({ ...settings, google_adsense_publisher_id: e.target.value });
                    }
                  }}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="font-mono text-sm"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Found in your AdSense account under Account → Settings
                </p>
              </div>

              <Button
                onClick={async () => {
                  setIsSaving(true);
                  setSaveSuccess(false); // Reset success state on new save attempt
                  try {
                    const payload = {
                      google_adsense_publisher_id: settings?.google_adsense_publisher_id
                    };
                    if (settings && settings.id) {
                      await SiteSettings.update(settings.id, payload);
                    } else {
                      // If no settings exist yet, create them.
                      await SiteSettings.create(payload);
                    }
                    setSaveSuccess(true);
                    await loadData(); // Reload data to get the updated settings ID if created, and current values
                    setTimeout(() => setSaveSuccess(false), 3000);
                  } catch (error) {
                    console.error('Failed to save AdSense ID:', error);
                    alert('Failed to save settings. Please try again.');
                  }
                  setIsSaving(false);
                }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>Saving...</>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save AdSense ID
                  </>
                )}
              </Button>

              {settings?.google_adsense_publisher_id && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">✅ AdSense Configured</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your Google AdSense Publisher ID is set. Ads will now display across your site.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How to Get Your Publisher ID</AlertTitle>
                <AlertDescription className="text-sm space-y-2">
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Sign up for Google AdSense at <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">google.com/adsense</a></li>
                    <li>Wait for approval (usually 1-2 weeks)</li>
                    <li>Go to Account → Settings in your AdSense dashboard</li>
                    <li>Copy your Publisher ID (starts with "ca-pub-")</li>
                    <li>Paste it above and save</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Stripe Configuration */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Stripe Configuration
              </CardTitle>
              <CardDescription>
                Configure Stripe for automated affiliate payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
                <Input
                  id="stripe-key"
                  value={stripeKey}
                  onChange={(e) => setStripeKey(e.target.value)}
                  placeholder="pk_test_... or pk_live_..."
                  className="font-mono text-sm"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Your Stripe publishable key (safe to show in frontend)
                </p>
              </div>

              <Button onClick={handleSaveStripeKey} disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>

              {settings?.stripe_publishable_key && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">✅ Step 1 Complete</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Stripe publishable key is configured. Now follow Step 2 below.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Integration Documentation - Always Visible for Admins */}
        {isAdmin && (
          <Card className="border-2 border-blue-500 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Code className="w-6 h-6 text-blue-600" />
                📚 Stripe Integration Setup Documentation
              </CardTitle>
              <CardDescription className="text-blue-800 font-semibold">
                Copy and paste this documentation into your base44 integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StripeIntegrationDocs />
            </CardContent>
          </Card>
        )}

        {/* Setup Instructions */}
        {isAdmin && (
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Setup Stripe Integration Function
              </CardTitle>
              <CardDescription>
                Add the backend function to your stripe-checkout integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>📋 Step 2: Create Integration in base44</AlertTitle>
                <AlertDescription className="space-y-4 mt-3">
                  <div className="space-y-3">
                    <p className="font-semibold text-sm">In your base44 dashboard:</p>

                    <div className="bg-white border rounded-lg p-4 space-y-3">
                      <p className="font-semibold text-sm flex items-center gap-2">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                        Go to <strong>Dashboard → Integrations</strong>
                      </p>

                      <p className="font-semibold text-sm flex items-center gap-2">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                        Click <strong>"Create New Integration"</strong>
                      </p>

                      <p className="font-semibold text-sm flex items-center gap-2">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                        Name it <strong>"stripe-checkout"</strong>
                      </p>

                      <p className="font-semibold text-sm flex items-center gap-2">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                        Add description: <strong>"Payments from stripe"</strong>
                      </p>

                      <p className="font-semibold text-sm flex items-center gap-2">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">5</span>
                        Copy the documentation above into the Integration Prompt and Implementation Guide fields
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert className="border-amber-500 bg-amber-50">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">⚙️ Step 3: Configure Environment Variables</AlertTitle>
                <AlertDescription className="text-amber-700 space-y-2 mt-2">
                  <p className="text-sm font-semibold">In your integration settings, add these environment variables:</p>
                  <div className="bg-white rounded p-3 space-y-2 text-xs font-mono">
                    <div>
                      <strong>STRIPE_SECRET_KEY</strong> = <span className="text-red-600">sk_test_...</span>
                      <p className="text-slate-500 text-[10px]">(Get this from your Stripe Dashboard → Developers → API Keys)</p>
                    </div>
                    <div>
                      <strong>APP_URL</strong> = <span className="text-blue-600">{window.location.origin}</span>
                      <p className="text-slate-500 text-[10px]">(Your app's current URL - update this if you add a custom domain)</p>
                    </div>
                    <div>
                      <strong>STRIPE_WEBHOOK_SECRET</strong> = <span className="text-purple-600">whsec_...</span>
                      <p className="text-slate-500 text-[10px]">(Create a webhook in Stripe Dashboard, you'll get this)</p>
                    </div>
                  </div>

                  <Alert className="mt-3 bg-blue-50 border-blue-200">
                    <Info className="h-3 w-3 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-xs">
                      <strong>Custom Domain:</strong> To use your own domain (e.g., cryptoaicentral.com), go to Dashboard → Settings → Domains and add your domain. Then update the APP_URL environment variable with your custom domain.
                    </AlertDescription>
                  </Alert>
                </AlertDescription>
              </Alert>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold">Function Code (after creating integration):</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyCode}
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={backendFunctionCode}
                  readOnly
                  className="font-mono text-xs h-96 bg-slate-50"
                />
              </div>

              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">🎉 What Happens After Setup?</AlertTitle>
                <AlertDescription className="text-green-700 text-sm space-y-2">
                  <p>Once configured, your affiliate program will:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Accept credit/debit card payments via Stripe</li>
                    <li>Automatically activate affiliate accounts after payment</li>
                    <li>Handle subscription renewals automatically</li>
                    <li>Send payment receipts via Stripe</li>
                    <li>Allow affiliates to manage their subscriptions</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Need Help?</AlertTitle>
                <AlertDescription className="text-sm">
                  If you get stuck or need assistance setting up the integration:
                  <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                    <li>Click the <strong>Feedback</strong> button in the sidebar</li>
                    <li>Send a message: "Need help setting up Stripe integration"</li>
                    <li>The base44 team can set it up for you or guide you through it</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Features & Integrations</h2>

          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={feature.status === 'active' || feature.status === 'configured' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {feature.status === 'configured' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configured
                        </>
                      ) : (
                        feature.status.replace('_', ' ')
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
