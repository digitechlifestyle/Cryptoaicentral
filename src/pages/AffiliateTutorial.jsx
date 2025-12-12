import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlayCircle, 
  CheckCircle, 
  DollarSign, 
  Link as LinkIcon, 
  Share2, 
  Users, 
  CreditCard,
  Wallet,
  Mail,
  Gift,
  TrendingUp,
  Info,
  ArrowRight,
  Copy,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AffiliateTutorial() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PlayCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Affiliate Program Tutorial</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Complete step-by-step guide to joining, getting paid, and earning 50% commissions
          </p>
          <Badge className="mt-4 text-lg px-4 py-2 bg-green-600">
            Earn $4.99 per Monthly Signup • $49.99 per Annual Signup
          </Badge>
        </div>

        {/* Video Placeholder */}
        <Card className="mb-8 border-2 border-blue-500">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
              <PlayCircle className="w-24 h-24 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Video Tutorial Coming Soon!</h3>
              <p className="text-blue-100">In the meantime, follow the detailed written guide below</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview">
              <Info className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="signup">
              <Users className="w-4 h-4 mr-2" />
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="promote">
              <Share2 className="w-4 h-4 mr-2" />
              Promote
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <TrendingUp className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">How It Works - 3 Simple Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Join & Pay Subscription</h3>
                      <p className="text-slate-600 mb-3">
                        Sign up for the affiliate program and pay the one-time subscription fee:
                      </p>
                      <ul className="list-disc ml-5 space-y-1 text-slate-600">
                        <li><strong>Monthly:</strong> $9.99/month (earn it back with 2 referrals)</li>
                        <li><strong>Annual:</strong> $99.99/year (earn it back with 2 referrals)</li>
                      </ul>
                      <Badge className="mt-3 bg-green-600">💡 50% Commission Rate!</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Get Your Unique Link</h3>
                      <p className="text-slate-600 mb-3">
                        Once approved, you'll receive:
                      </p>
                      <ul className="list-disc ml-5 space-y-1 text-slate-600">
                        <li>Personal referral link (e.g., cryptoaicentral.com/?ref=YOUR-CODE)</li>
                        <li>Access to marketing tools & AI content generators</li>
                        <li>Email templates & autoresponders</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Share & Earn Money</h3>
                      <p className="text-slate-600 mb-3">
                        Promote your link and earn recurring commissions:
                      </p>
                      <ul className="list-disc ml-5 space-y-1 text-slate-600">
                        <li>Earn <strong className="text-green-600">$4.99</strong> per monthly referral</li>
                        <li>Earn <strong className="text-green-600">$49.99</strong> per annual referral</li>
                        <li>Commissions paid monthly via PayPal or crypto</li>
                      </ul>
                      <Badge className="mt-3 bg-yellow-600">🎯 Lifetime recurring commissions!</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert className="bg-blue-50 border-blue-500">
                <Gift className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800 font-bold">What You Get as an Affiliate</AlertTitle>
                <AlertDescription className="text-blue-700 mt-2">
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>50% Commission</strong> on all sales (forever)</li>
                    <li><strong>AI Marketing Tools</strong> - Blog posts, social media content</li>
                    <li><strong>Email Marketing</strong> - Templates & autoresponders</li>
                    <li><strong>Analytics Dashboard</strong> - Track clicks, signups, earnings</li>
                    <li><strong>Marketing Materials</strong> - Banners, graphics, copy</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Step 1: Create Your Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg">Visit the Affiliate Program Page</h4>
                      <p className="text-slate-600 mb-2">
                        Go to the Affiliate Program page and click "Join Affiliate Program"
                      </p>
                      <Link to={createPageUrl("AffiliateProgram")}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Go to Affiliate Program
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg">Create Free Account</h4>
                      <p className="text-slate-600">
                        If you don't have an account yet, click "Sign Up" in the top right corner. 
                        Use your email to create a free account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg">Choose Your Plan</h4>
                      <p className="text-slate-600 mb-3">
                        Select Monthly ($9.99) or Annual ($99.99). Annual saves you money!
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="font-bold text-blue-900">💳 Monthly Plan</p>
                          <p className="text-2xl font-bold text-blue-600">$9.99/mo</p>
                          <p className="text-sm text-blue-700">Break even with 2 referrals</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-500">
                          <Badge className="mb-2 bg-green-600">BEST VALUE</Badge>
                          <p className="font-bold text-green-900">🎯 Annual Plan</p>
                          <p className="text-2xl font-bold text-green-600">$99.99/yr</p>
                          <p className="text-sm text-green-700">Break even with 2 referrals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tip:</strong> Annual plan gives you 12 months for the price of 10 months!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    Step 2: Submit Your Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-yellow-50 border-yellow-500">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      After signing up, you'll be redirected to your <strong>Dashboard → Payment tab</strong> to submit payment.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-lg mb-3">Payment Option 1: PayPal (Recommended)</h4>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <ol className="list-decimal ml-5 space-y-2">
                          <li>Click <strong>"Pay with PayPal"</strong> button</li>
                          <li>You'll be redirected to PayPal's secure checkout</li>
                          <li>Complete payment ($9.99 or $99.99)</li>
                          <li>Return to the site - <strong>Your account is activated instantly!</strong></li>
                        </ol>
                        <Badge className="mt-3 bg-green-600">✅ Instant Activation</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-3">Payment Option 2: Cryptocurrency</h4>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="font-semibold mb-2">We accept 10 cryptocurrencies:</p>
                        <div className="grid md:grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Bitcoin (BTC)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Ethereum (ETH)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>USDC (Stablecoin)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>USDT (Stablecoin)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Stellar (XLM)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>XRP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>RLUSD</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Hedera (HBAR)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Solana (SOL)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>XDC Network</span>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded border mt-3">
                          <p className="font-bold mb-2">How to pay with crypto:</p>
                          <ol className="list-decimal ml-5 space-y-1 text-sm">
                            <li>Select your cryptocurrency</li>
                            <li>Copy the wallet address (+ memo/tag if required)</li>
                            <li>Send payment from your wallet</li>
                            <li>Copy the transaction ID</li>
                            <li>Paste transaction ID in the form and submit</li>
                            <li>We verify within 24 hours and activate your account</li>
                          </ol>
                        </div>

                        <Badge className="mt-3 bg-orange-500">⏳ Activation within 24 hours</Badge>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-green-50 border-green-500">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Payment Successful!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Once payment is confirmed, you'll get access to your dashboard with your unique referral link and all marketing tools!
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Promote Tab */}
          <TabsContent value="promote">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Share2 className="w-6 h-6 text-purple-600" />
                    Step 3: Promote Your Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold mb-2 text-blue-900">Your Unique Referral Link</h4>
                    <div className="flex items-center gap-2 bg-white p-3 rounded border mb-2">
                      <code className="flex-1 text-sm">https://cryptoaicentral.com/?ref=YOUR-CODE</code>
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-blue-700">
                      Find this in your <strong>Dashboard → Overview</strong> tab
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-3">Where to Promote Your Link</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <h5 className="font-bold mb-2">🐦 Social Media</h5>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                          <li>Twitter/X threads about crypto tools</li>
                          <li>LinkedIn posts for professionals</li>
                          <li>Reddit (r/CryptoCurrency, r/Crypto_General)</li>
                          <li>Facebook groups</li>
                          <li>TikTok crypto education videos</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <h5 className="font-bold mb-2">📧 Email Marketing</h5>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                          <li>Send to your email list</li>
                          <li>Use our email templates</li>
                          <li>Set up autoresponders</li>
                          <li>Newsletter mentions</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <h5 className="font-bold mb-2">🌐 Website/Blog</h5>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                          <li>Write reviews of crypto tools</li>
                          <li>Create comparison articles</li>
                          <li>Add banners to sidebar</li>
                          <li>Resource pages</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <h5 className="font-bold mb-2">🎥 Video Content</h5>
                        <ul className="list-disc ml-5 text-sm space-y-1">
                          <li>YouTube reviews/tutorials</li>
                          <li>TikTok short videos</li>
                          <li>Instagram Reels</li>
                          <li>Twitch streams</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold mb-3 text-green-900">🤖 Free Marketing Tools Available</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <strong>AI Blog Post Generator</strong>
                          <p className="text-sm text-green-700">Create SEO-optimized articles about crypto tools</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <strong>Social Media Content Generator</strong>
                          <p className="text-sm text-green-700">Generate Twitter threads, LinkedIn posts, TikTok scripts</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <strong>Email Templates</strong>
                          <p className="text-sm text-green-700">Pre-written promotional emails you can customize</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <strong>Banner Graphics</strong>
                          <p className="text-sm text-green-700">Professional banners for your website</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>💡 Promotion Tips & Best Practices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-600">Tip 1</Badge>
                    <p className="text-slate-600">
                      <strong>Be authentic:</strong> Share your genuine experience with CryptoAI Central. 
                      People trust real recommendations.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-purple-600">Tip 2</Badge>
                    <p className="text-slate-600">
                      <strong>Provide value:</strong> Don't just spam links. Create helpful content that 
                      explains why these tools are useful.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-600">Tip 3</Badge>
                    <p className="text-slate-600">
                      <strong>Use multiple channels:</strong> Don't rely on just one platform. Diversify 
                      your promotion across social media, email, and content.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-orange-600">Tip 4</Badge>
                    <p className="text-slate-600">
                      <strong>Track what works:</strong> Check your dashboard analytics to see which 
                      channels drive the most signups.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    Step 4: Get Paid & Track Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border-2 border-green-500">
                      <DollarSign className="w-12 h-12 text-green-600 mb-3" />
                      <h4 className="font-bold text-xl mb-2 text-green-900">Monthly Referral</h4>
                      <p className="text-3xl font-bold text-green-600 mb-2">$4.99</p>
                      <p className="text-sm text-green-700">Per subscriber per month</p>
                      <div className="mt-4 text-sm text-green-800">
                        <p className="font-semibold">Example:</p>
                        <p>10 monthly referrals = <strong>$49.90/month</strong></p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-500">
                      <DollarSign className="w-12 h-12 text-blue-600 mb-3" />
                      <h4 className="font-bold text-xl mb-2 text-blue-900">Annual Referral</h4>
                      <p className="text-3xl font-bold text-blue-600 mb-2">$49.99</p>
                      <p className="text-sm text-blue-700">Per subscriber per year</p>
                      <div className="mt-4 text-sm text-blue-800">
                        <p className="font-semibold">Example:</p>
                        <p>10 annual referrals = <strong>$499.90/year</strong></p>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-yellow-50 border-yellow-500">
                    <Gift className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">💰 Lifetime Recurring Commissions!</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      You earn commissions for as long as your referrals stay subscribed. This means passive income every month!
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h4 className="font-bold text-lg mb-3">How & When You Get Paid</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                          <p className="font-semibold">Payout Schedule</p>
                          <p className="text-slate-600 text-sm">
                            Commissions are paid monthly, around the 5th of each month for the previous month's earnings.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                          <p className="font-semibold">Minimum Payout</p>
                          <p className="text-slate-600 text-sm">
                            $25 minimum (accumulates until you reach this threshold)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                          <p className="font-semibold">Payment Methods</p>
                          <p className="text-slate-600 text-sm">
                            PayPal or any of the 10 cryptocurrencies we support (your choice!)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="font-bold mb-3">Track Your Performance in Real-Time</h4>
                    <p className="text-slate-600 mb-3">Your dashboard shows:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">Clicks</Badge>
                        <span className="text-sm">How many people clicked your link</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">Signups</Badge>
                        <span className="text-sm">How many people joined using your link</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">Earnings</Badge>
                        <span className="text-sm">Your current commission balance</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Earnings Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2">
                          <th className="text-left p-2">Referrals</th>
                          <th className="text-right p-2">Monthly</th>
                          <th className="text-right p-2">Annual</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">5 referrals</td>
                          <td className="text-right p-2 font-semibold">$24.95/mo</td>
                          <td className="text-right p-2 font-semibold">$249.95/yr</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">10 referrals</td>
                          <td className="text-right p-2 font-semibold">$49.90/mo</td>
                          <td className="text-right p-2 font-semibold">$499.90/yr</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">25 referrals</td>
                          <td className="text-right p-2 font-semibold text-green-600">$124.75/mo</td>
                          <td className="text-right p-2 font-semibold text-green-600">$1,249.75/yr</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">50 referrals</td>
                          <td className="text-right p-2 font-semibold text-green-600">$249.50/mo</td>
                          <td className="text-right p-2 font-semibold text-green-600">$2,499.50/yr</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">100 referrals</td>
                          <td className="text-right p-2 text-lg font-bold text-green-600">$499/mo</td>
                          <td className="text-right p-2 text-lg font-bold text-green-600">$4,999/yr</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="text-xl mb-6 text-blue-100">
              Join today and start building your passive income stream!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to={createPageUrl("AffiliateProgram")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  <Users className="w-5 h-5 mr-2" />
                  Join Affiliate Program
                </Button>
              </Link>
              <Link to={createPageUrl("Dashboard")}>
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-bold mb-1">Q: How long does payment verification take?</h4>
              <p className="text-slate-600 text-sm">
                PayPal payments are instant. Crypto payments are verified within 24 hours.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-1">Q: Can I cancel my subscription?</h4>
              <p className="text-slate-600 text-sm">
                Yes, you can cancel anytime. You'll continue earning commissions from your existing referrals 
                even after canceling your subscription.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-1">Q: What if I don't have an audience yet?</h4>
              <p className="text-slate-600 text-sm">
                That's okay! Use our AI tools to create content, build an audience on social media, 
                and start promoting. Many successful affiliates started from zero.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-1">Q: Do commissions expire?</h4>
              <p className="text-slate-600 text-sm">
                No! You earn lifetime recurring commissions as long as your referrals stay subscribed.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-1">Q: Can I promote on multiple platforms?</h4>
              <p className="text-slate-600 text-sm">
                Absolutely! Use your referral link on all your platforms - website, social media, email, videos, etc.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}