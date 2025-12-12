
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, DollarSign, BarChart, Users, Loader2, ExternalLink, CheckCircle, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ✅ PAYPAL PAYMENT LINKS - READY TO USE
const PAYPAL_MONTHLY_LINK = "https://www.paypal.com/ncp/payment/WNJM7LVCYTBDQ";
const PAYPAL_ANNUAL_LINK = "https://www.paypal.com/ncp/payment/GK24KQLJ8NSN6";

export default function AffiliateProgram() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [affiliate, setAffiliate] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      const affiliateData = await base44.entities.Affiliate.filter({ user_email: userData.email });
      if (affiliateData.length > 0) {
        setAffiliate(affiliateData[0]);
      }
    } catch (error) {
      // User not logged in
      setUser(null);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Show notice if already an affiliate */}
      {user && affiliate && affiliate.status === 'active' && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">You're Already an Affiliate!</AlertTitle>
            <AlertDescription className="text-green-700">
              You already have an active affiliate account. 
              <Link to={createPageUrl("Dashboard")} className="font-bold underline ml-1">
                Go to your Dashboard
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            💰 Earn 50% Commission
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join Our Affiliate Program
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Earn 50% recurring commissions + get 2 months FREE access to AI marketing tools, email automation, and content creation.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Monthly Plan */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all">
              <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardTitle className="text-2xl">Monthly</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-blue-600">$9.99</span>
                  <span className="text-slate-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Earn 50% commissions on all referrals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>2 months FREE AI marketing tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Email automation & sequences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>AI content generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Real-time analytics dashboard</span>
                  </li>
                </ul>
                
                <div className="space-y-2">
                  {user ? (
                    <>
                      <a 
                        href={PAYPAL_MONTHLY_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Pay with PayPal - $9.99/mo
                        </Button>
                      </a>
                      
                      <Link to={createPageUrl("Dashboard") + "?tab=payment&plan=monthly"}>
                        <Button size="lg" variant="outline" className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50">
                          🪙 Or Pay with Crypto
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={createPageUrl("Dashboard") + "?from_affiliate=true&plan=monthly"}>
                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                          Sign In to Pay with PayPal or Crypto
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                Save $20/year
              </Badge>
              <CardHeader className="text-center bg-gradient-to-br from-purple-50 to-pink-50">
                <CardTitle className="text-2xl">Annual</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-purple-600">$99.99</span>
                  <span className="text-slate-600">/year</span>
                </div>
                <p className="text-sm text-green-600 font-semibold mt-2">Save $20 vs monthly!</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Everything in Monthly, plus:</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Save $20 per year</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Early access to new features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Annual strategy consultation</span>
                  </li>
                </ul>
                
                <div className="space-y-2">
                  {user ? (
                    <>
                      <a 
                        href={PAYPAL_ANNUAL_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Pay with PayPal - $99.99/yr
                        </Button>
                      </a>
                      
                      <Link to={createPageUrl("Dashboard") + "?tab=payment&plan=annual"}>
                        <Button size="lg" variant="outline" className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50">
                          🪙 Or Pay with Crypto
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={createPageUrl("Dashboard") + "?from_affiliate=true&plan=annual"}>
                        <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                          Sign In to Pay with PayPal or Crypto
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* After Payment Instructions */}
          <Alert className="mt-12 max-w-4xl mx-auto border-yellow-500 bg-yellow-50">
            <AlertTitle className="text-yellow-900 font-bold">📝 After Payment:</AlertTitle>
            <AlertDescription className="text-yellow-800">
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Complete your payment (PayPal or Crypto)</li>
                <li>Go to your Dashboard (create account if needed)</li>
                <li>Submit your payment proof for verification</li>
                <li>We'll activate your account within 24 hours</li>
                <li>Start earning 50% commissions immediately!</li>
              </ol>
            </AlertDescription>
          </Alert>
        </div>
      </section>
      <div className="text-center mb-8">
        <Link to={createPageUrl("AffiliateTutorial")}>
          <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
            <PlayCircle className="w-5 h-5 mr-2" />
            View Complete Tutorial & Walkthrough
          </Button>
        </Link>
      </div>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Join?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <DollarSign className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>50% Recurring Commissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Earn $50 for every $100 your referrals spend. Commissions continue as long as they stay subscribed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Professional Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get 2 months FREE access to AI marketing tools, email automation, and content generation worth $20/month.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Real-Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Track clicks, signups, and earnings in real-time with your personalized affiliate dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get paid?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We pay commissions monthly via PayPal, crypto, or bank transfer. Minimum payout is $50.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in the 2 months free tools?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  AI content generation, email marketing automation, autoresponder sequences, social media tools, and analytics dashboard - worth $20/month.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! Cancel anytime through your dashboard. Your affiliate link stays active, but you'll lose access to the marketing tools.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does activation take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We verify payments and activate accounts within 24 hours. You'll receive an email confirmation when you're ready to start promoting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of affiliates already earning 50% commissions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={user ? `${PAYPAL_MONTHLY_LINK}` : createPageUrl("Dashboard") + "?from_affiliate=true"}
              target={user ? "_blank" : "_self"}
              rel={user ? "noopener noreferrer" : ""}
              onClick={() => !user && localStorage.setItem('pending_affiliate_signup', 'monthly')}
            >
              <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100">
                Start Monthly ($9.99)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a 
              href={user ? `${PAYPAL_ANNUAL_LINK}` : createPageUrl("Dashboard") + "?from_affiliate=true"}
              target={user ? "_blank" : "_self"}
              rel={user ? "noopener noreferrer" : ""}
              onClick={() => !user && localStorage.setItem('pending_affiliate_signup', 'annual')}
            >
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                Save with Annual ($99.99)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
