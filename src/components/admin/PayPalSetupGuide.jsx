import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, ArrowRight, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PayPalSetupGuide() {
  return (
    <div className="space-y-8">
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <AlertTitle className="text-green-900 font-bold text-xl">
          ✅ Affiliate Links Already Complete!
        </AlertTitle>
        <AlertDescription className="text-green-800 text-base">
          Your affiliate program PayPal links are set up. Now let's create the 4 banner advertising links.
        </AlertDescription>
      </Alert>

      {/* Step 1: Open PayPal */}
      <Card className="border-2 border-purple-500">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-xl">Step 1️⃣: Open PayPal Payment Links</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-slate-700">Click this button to open PayPal in a new tab:</p>
          <a 
            href="https://www.paypal.com/ncp/links/create" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-5 h-5 mr-2" />
              Open PayPal Payment Links Creator
            </Button>
          </a>
          
          <Alert className="bg-purple-50 border-purple-500">
            <MousePointer className="w-5 h-5 text-purple-600" />
            <AlertTitle className="text-purple-900 font-bold">Important First Click!</AlertTitle>
            <AlertDescription className="text-purple-800">
              When PayPal opens, you'll see two options at the top:
              <div className="mt-3 space-y-2">
                <div className="bg-white rounded p-3 border-2 border-purple-600">
                  <p className="font-bold">✅ Click: "Payment link & QR code"</p>
                  <p className="text-sm">(This option allows subscriptions)</p>
                </div>
                <div className="bg-slate-100 rounded p-3 border">
                  <p className="font-bold text-slate-500">❌ Don't click: "Payment buttons"</p>
                  <p className="text-sm text-slate-500">(This is for one-time payments only)</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Banner Ads Section */}
      <Alert className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-500">
        <AlertTitle className="text-indigo-900 font-bold text-xl">
          🎯 Create 4 Banner Ad Payment Links
        </AlertTitle>
        <AlertDescription className="text-indigo-800 text-base mt-2">
          All banner ads are annual subscriptions. You'll create 4 links total.
        </AlertDescription>
      </Alert>

      {/* Mobile Banner */}
      <Card className="border-2 border-orange-500">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-xl">Step 2️⃣: Mobile Banner - $49/year</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
            <label className="font-bold text-slate-900 block mb-2">Item name:</label>
            <div className="bg-slate-100 px-4 py-3 rounded font-mono text-sm">
              CryptoAI Central - Mobile Banner Ad (320x50)
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg border-2 border-yellow-400 p-4">
            <label className="font-bold text-yellow-900 block mb-3">⚠️ Price Section (Important):</label>
            <div className="space-y-2 text-slate-700">
              <p>1. Click <strong>"Choose type"</strong> (NOT "One set price")</p>
              <p>2. Select <strong>"Subscription"</strong> from dropdown</p>
              <p>3. Price: <strong className="text-orange-600">49.00</strong></p>
              <p>4. Billing cycle: <strong>Every 12 months</strong></p>
            </div>
          </div>

          <Alert className="bg-orange-50 border-orange-500">
            <AlertDescription>
              <strong>Description (optional):</strong> Annual mobile banner advertising (320x50 pixels) - appears on mobile devices across the site
            </AlertDescription>
          </Alert>

          <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-4">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Then:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-orange-800">
              <li>Click <strong>"Create Link"</strong> at the bottom</li>
              <li>Copy the entire PayPal link</li>
              <li>Save it somewhere - you'll need it in Step 6</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Rectangle Banner */}
      <Card className="border-2 border-green-500">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-xl">Step 3️⃣: Rectangle Banner - $99/year</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Alert className="bg-blue-50 border-blue-500">
            <AlertDescription className="text-blue-800">
              Go back to <a href="https://www.paypal.com/ncp/links/create" target="_blank" rel="noopener noreferrer" className="underline font-bold">PayPal Payment Links</a> and create another link
            </AlertDescription>
          </Alert>

          <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
            <label className="font-bold text-slate-900 block mb-2">Item name:</label>
            <div className="bg-slate-100 px-4 py-3 rounded font-mono text-sm">
              CryptoAI Central - Rectangle Banner Ad (300x250)
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg border-2 border-yellow-400 p-4">
            <label className="font-bold text-yellow-900 block mb-3">⚠️ Price Section:</label>
            <div className="space-y-2 text-slate-700">
              <p>1. Click <strong>"Choose type"</strong> → Select <strong>"Subscription"</strong></p>
              <p>2. Price: <strong className="text-green-600">99.00</strong></p>
              <p>3. Billing cycle: <strong>Every 12 months</strong></p>
            </div>
          </div>

          <Alert className="bg-green-50 border-green-500">
            <AlertDescription>
              <strong>Description (optional):</strong> Annual rectangle banner advertising (300x250 pixels) - appears in sidebar and content areas
            </AlertDescription>
          </Alert>

          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <h4 className="font-bold text-green-900 mb-2">After creating:</h4>
            <p className="text-green-800">Copy the PayPal link and save it</p>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Banner */}
      <Card className="border-2 border-blue-500">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-xl">Step 4️⃣: Leaderboard Banner - $199/year</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Alert className="bg-blue-50 border-blue-500">
            <AlertDescription className="text-blue-800">
              Create another link at <a href="https://www.paypal.com/ncp/links/create" target="_blank" rel="noopener noreferrer" className="underline font-bold">PayPal Payment Links</a>
            </AlertDescription>
          </Alert>

          <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
            <label className="font-bold text-slate-900 block mb-2">Item name:</label>
            <div className="bg-slate-100 px-4 py-3 rounded font-mono text-sm">
              CryptoAI Central - Leaderboard Banner Ad (728x90)
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg border-2 border-yellow-400 p-4">
            <label className="font-bold text-yellow-900 block mb-3">⚠️ Price Section:</label>
            <div className="space-y-2 text-slate-700">
              <p>1. Click <strong>"Choose type"</strong> → Select <strong>"Subscription"</strong></p>
              <p>2. Price: <strong className="text-blue-600">199.00</strong></p>
              <p>3. Billing cycle: <strong>Every 12 months</strong></p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-500">
            <AlertDescription>
              <strong>Description (optional):</strong> Annual leaderboard banner advertising (728x90 pixels) - premium placement at top of pages
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">After creating:</h4>
            <p className="text-blue-800">Copy the PayPal link and save it</p>
          </div>
        </CardContent>
      </Card>

      {/* Vertical Banner */}
      <Card className="border-2 border-purple-500">
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-xl">Step 5️⃣: Vertical Banner - $249/year</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Alert className="bg-purple-50 border-purple-500">
            <AlertDescription className="text-purple-800">
              Last one! Create final link at <a href="https://www.paypal.com/ncp/links/create" target="_blank" rel="noopener noreferrer" className="underline font-bold">PayPal Payment Links</a>
            </AlertDescription>
          </Alert>

          <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
            <label className="font-bold text-slate-900 block mb-2">Item name:</label>
            <div className="bg-slate-100 px-4 py-3 rounded font-mono text-sm">
              CryptoAI Central - Vertical Banner Ad (300x600)
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg border-2 border-yellow-400 p-4">
            <label className="font-bold text-yellow-900 block mb-3">⚠️ Price Section:</label>
            <div className="space-y-2 text-slate-700">
              <p>1. Click <strong>"Choose type"</strong> → Select <strong>"Subscription"</strong></p>
              <p>2. Price: <strong className="text-purple-600">249.00</strong></p>
              <p>3. Billing cycle: <strong>Every 12 months</strong></p>
            </div>
          </div>

          <Alert className="bg-purple-50 border-purple-500">
            <AlertDescription>
              <strong>Description (optional):</strong> Annual vertical banner advertising (300x600 pixels) - high-impact sidebar placement
            </AlertDescription>
          </Alert>

          <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-4">
            <h4 className="font-bold text-purple-900 mb-2">After creating:</h4>
            <p className="text-purple-800">Copy the PayPal link and save it</p>
          </div>
        </CardContent>
      </Card>

      {/* Final Step: Update Code */}
      <Card className="border-2 border-red-500">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-xl">Step 6️⃣: Send Me Your 4 PayPal Links</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <Alert>
            <AlertTitle className="font-bold">You should now have 4 new PayPal links:</AlertTitle>
            <AlertDescription className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>1. Mobile Banner ($49/year)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>2. Rectangle Banner ($99/year)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>3. Leaderboard Banner ($199/year)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>4. Vertical Banner ($249/year)</span>
              </div>
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-50 border-blue-500">
            <AlertTitle className="text-blue-900 font-bold">📨 Send Me These Links:</AlertTitle>
            <AlertDescription className="text-blue-800 space-y-2 mt-2">
              <p>Copy all 4 PayPal links and paste them in the chat like this:</p>
              <div className="bg-white rounded p-3 mt-2 font-mono text-xs">
                <p>Mobile: https://www.paypal.com/ncp/payment/XXXXX</p>
                <p>Rectangle: https://www.paypal.com/ncp/payment/XXXXX</p>
                <p>Leaderboard: https://www.paypal.com/ncp/payment/XXXXX</p>
                <p>Vertical: https://www.paypal.com/ncp/payment/XXXXX</p>
              </div>
              <p className="mt-3 font-bold">I'll update your code with all 4 links instantly! 🚀</p>
            </AlertDescription>
          </Alert>

          <Alert className="bg-green-50 border-green-500">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <AlertTitle className="text-green-900 font-bold">Almost Done!</AlertTitle>
            <AlertDescription className="text-green-800">
              Once I add your PayPal links, your banner advertising system will be complete. Companies can pay via PayPal or any of your 10 cryptocurrencies!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}