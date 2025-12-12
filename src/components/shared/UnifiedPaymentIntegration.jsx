import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Coins, Zap, ArrowRight } from 'lucide-react';

export default function UnifiedPaymentIntegration() {
  return (
    <Card className="border-2 border-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          Hyp Payments Integration
          <Badge className="ml-2 bg-green-500">Recommended</Badge>
        </CardTitle>
        <CardDescription>
          Unified payment gateway supporting credit cards, PayPal, crypto, and tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Alert className="border-blue-500 bg-blue-50">
          <AlertTitle className="text-blue-900 font-bold">✨ All-in-One Payment Solution</AlertTitle>
          <AlertDescription className="text-blue-800">
            <div className="space-y-3 mt-2">
              <p className="font-semibold">What Hyp Payments offers:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CreditCard className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Traditional Payments</p>
                    <p className="text-xs">Credit cards, debit cards, PayPal, bank transfers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Coins className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Crypto Payments</p>
                    <p className="text-xs">BTC, ETH, USDC, USDT, XRP, SOL, and 100+ tokens</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Automatic Verification</p>
                    <p className="text-xs">Instant payment confirmation via webhooks</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">No Manual Processing</p>
                    <p className="text-xs">Payments verified and accounts activated automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <div className="bg-slate-50 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-slate-900">🚀 How to Enable Hyp Payments:</h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Enable Backend Functions</p>
                <p className="text-sm text-slate-600">
                  Go to <strong>Dashboard → Settings</strong> and enable <strong>"Backend Functions"</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Request Integration</p>
                <p className="text-sm text-slate-600">
                  Click the <strong>Feedback</strong> button in the sidebar and request:
                </p>
                <div className="mt-2 bg-white rounded border border-blue-200 p-3">
                  <p className="text-sm font-mono text-blue-900">
                    "Enable Hyp Payments integration for affiliate subscriptions. 
                    Need support for credit cards, PayPal, and crypto (BTC, ETH, USDC, USDT, XRP, SOL, tokens)."
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Integration Setup</p>
                <p className="text-sm text-slate-600">
                  The base44 team will:
                </p>
                <ul className="text-sm text-slate-600 list-disc list-inside mt-1 space-y-1">
                  <li>Set up Hyp Payments merchant account</li>
                  <li>Configure webhook endpoints for automatic verification</li>
                  <li>Add payment UI components to your app</li>
                  <li>Test the complete payment flow</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Ready to Use!</p>
                <p className="text-sm text-slate-600">
                  Users can pay with any method, and affiliates are activated instantly upon payment confirmation
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 Pricing Information</h4>
          <p className="text-sm text-yellow-800">
            Hyp Payments typically charges:
          </p>
          <ul className="text-sm text-yellow-800 list-disc list-inside mt-2 space-y-1">
            <li><strong>Credit Cards:</strong> 2.9% + $0.30 per transaction</li>
            <li><strong>Crypto:</strong> 1% flat fee (much lower than cards)</li>
            <li><strong>Tokens:</strong> 0.5-1% depending on token</li>
          </ul>
          <p className="text-xs text-yellow-700 mt-2">
            Exact rates depend on your volume. Higher volume = lower fees.
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">✅ After Integration</h4>
          <p className="text-sm text-green-800">
            Once Hyp Payments is enabled, the payment flow becomes:
          </p>
          <ol className="text-sm text-green-800 list-decimal list-inside mt-2 space-y-1">
            <li>User clicks "Subscribe" and selects monthly/annual plan</li>
            <li>User chooses payment method (card, PayPal, or 100+ cryptos)</li>
            <li>Payment processed through Hyp Payments</li>
            <li>Webhook confirms payment to base44</li>
            <li>Affiliate account activated automatically</li>
            <li>User gets instant access - no admin approval needed!</li>
          </ol>
        </div>

        <Alert>
          <AlertTitle className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Alternative: Stripe + CoinPayments
          </AlertTitle>
          <AlertDescription className="text-sm">
            If Hyp Payments isn't available, you can use:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Stripe</strong> for credit cards (request "Enable Stripe Integration")</li>
              <li><strong>CoinPayments</strong> or <strong>NOWPayments</strong> for crypto (request specific provider)</li>
            </ul>
            <p className="mt-2 text-xs text-slate-600">
              Note: Two integrations mean separate admin dashboards and webhook setups
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}