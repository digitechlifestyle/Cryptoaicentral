import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, ExternalLink, Copy, Info } from "lucide-react";

export default function PaymentIntegrationGuide() {
  const [copied, setCopied] = useState('');

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const integrations = [
    {
      name: "Stripe (Already Set Up ✅)",
      type: "Card Payments",
      pros: ["Credit/debit cards", "Subscriptions", "Auto-renewal", "Already configured"],
      cons: ["Crypto not supported"],
      status: "active",
      difficulty: "Easy - Already done!",
      recommended: true
    },
    {
      name: "PayPal Crypto",
      type: "Limited Crypto",
      pros: ["Users can buy crypto in PayPal", "Familiar interface"],
      cons: ["NO API for businesses", "Can't accept crypto directly", "Only for personal use"],
      status: "not_recommended",
      difficulty: "Not available for business use",
      recommended: false
    },
    {
      name: "Coinbase Commerce",
      type: "Full Crypto Payments",
      pros: ["BTC, ETH, USDC, USDT", "Easy integration", "Free to use", "Instant notifications"],
      cons: ["Separate from PayPal", "Users need crypto wallet"],
      status: "available",
      difficulty: "Medium - Needs backend function",
      recommended: true,
      setupUrl: "https://commerce.coinbase.com"
    },
    {
      name: "NOWPayments",
      type: "Multi-Crypto Gateway",
      pros: ["100+ cryptocurrencies", "Subscriptions", "Auto-conversion to USD", "Good API"],
      cons: ["0.5% fee", "KYC required"],
      status: "available",
      difficulty: "Medium - Needs backend function",
      recommended: true,
      setupUrl: "https://nowpayments.io"
    },
    {
      name: "CoinGate",
      type: "Crypto Payment Processor",
      pros: ["70+ cryptos", "Lightning Network", "Auto-convert to EUR/USD", "Good for EU"],
      cons: ["1% fee", "Europe-focused"],
      status: "available",
      difficulty: "Medium - Needs backend function",
      recommended: true,
      setupUrl: "https://coingate.com"
    },
    {
      name: "BTCPay Server",
      type: "Self-Hosted Crypto",
      pros: ["No fees", "Full control", "Open source", "Privacy-focused"],
      cons: ["Complex setup", "Need own server", "Technical knowledge required"],
      status: "available",
      difficulty: "Hard - For advanced users",
      recommended: false
    }
  ];

  const coinbaseCommerceCode = `/**
 * Coinbase Commerce Integration
 * FREE crypto payments - BTC, ETH, USDC, USDT, more
 * 
 * Environment variables needed:
 * - COINBASE_API_KEY: Your Coinbase Commerce API key
 * - APP_URL: Your app URL
 */

const axios = require('axios');

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'POST') {
    try {
      const { affiliateId, userEmail, plan } = JSON.parse(body);
      
      const amount = plan === 'annual' ? '99.99' : '9.99';
      
      // Create Coinbase Commerce charge
      const response = await axios.post(
        'https://api.commerce.coinbase.com/charges',
        {
          name: \`CryptoAI Central - \${plan} Subscription\`,
          description: 'Affiliate program subscription',
          pricing_type: 'fixed_price',
          local_price: {
            amount: amount,
            currency: 'USD'
          },
          metadata: {
            affiliateId: affiliateId,
            userEmail: userEmail,
            plan: plan
          },
          redirect_url: \`\${process.env.APP_URL}/Dashboard?payment=success\`,
          cancel_url: \`\${process.env.APP_URL}/AffiliateProgram?payment=cancelled\`
        },
        {
          headers: {
            'X-CC-Api-Key': process.env.COINBASE_API_KEY,
            'X-CC-Version': '2018-03-22'
          }
        }
      );

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          checkoutUrl: response.data.data.hosted_url,
          chargeId: response.data.data.id
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};`;

  const nowPaymentsCode = `/**
 * NOWPayments Integration
 * 100+ cryptocurrencies supported
 * 
 * Environment variables needed:
 * - NOWPAYMENTS_API_KEY: Your NOWPayments API key
 * - APP_URL: Your app URL
 */

const axios = require('axios');

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  if (httpMethod === 'POST') {
    try {
      const { affiliateId, userEmail, plan, currency } = JSON.parse(body);
      
      const amount = plan === 'annual' ? 99.99 : 9.99;
      
      // Create NOWPayments invoice
      const response = await axios.post(
        'https://api.nowpayments.io/v1/invoice',
        {
          price_amount: amount,
          price_currency: 'usd',
          pay_currency: currency || 'btc', // btc, eth, usdt, etc.
          order_id: \`affiliate_\${affiliateId}_\${Date.now()}\`,
          order_description: \`\${plan} subscription\`,
          success_url: \`\${process.env.APP_URL}/Dashboard?payment=success\`,
          cancel_url: \`\${process.env.APP_URL}/AffiliateProgram?payment=cancelled\`
        },
        {
          headers: {
            'x-api-key': process.env.NOWPAYMENTS_API_KEY
          }
        }
      );

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          invoiceUrl: response.data.invoice_url,
          invoiceId: response.data.id
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💳 Payment Integration Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-500">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Current Status</AlertTitle>
            <AlertDescription className="text-blue-700">
              ✅ <strong>Stripe</strong> is already set up for credit/debit card payments
              <br />
              💡 Choose ONE crypto option below if you want to accept cryptocurrency
            </AlertDescription>
          </Alert>

          {/* Integration Comparison */}
          <div className="space-y-4">
            {integrations.map((integration, index) => (
              <Card key={index} className={integration.recommended ? 'border-2 border-green-500' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {integration.name}
                        {integration.recommended && <Badge className="bg-green-600">Recommended</Badge>}
                      </h3>
                      <p className="text-sm text-slate-600">{integration.type}</p>
                    </div>
                    <Badge variant={
                      integration.status === 'active' ? 'default' :
                      integration.status === 'not_recommended' ? 'destructive' : 'secondary'
                    }>
                      {integration.status === 'active' ? '✅ Active' :
                       integration.status === 'not_recommended' ? '❌ Not Available' : '🔧 Available'}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-green-700 mb-2">✅ Pros:</p>
                      <ul className="text-sm space-y-1">
                        {integration.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-2">❌ Cons:</p>
                      <ul className="text-sm space-y-1">
                        {integration.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-slate-600">
                      <strong>Setup:</strong> {integration.difficulty}
                    </span>
                    {integration.setupUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={integration.setupUrl} target="_blank" rel="noopener noreferrer">
                          Learn More <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Code Examples */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle>📝 Integration Code Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="coinbase">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="coinbase">Coinbase Commerce</TabsTrigger>
                  <TabsTrigger value="nowpayments">NOWPayments</TabsTrigger>
                </TabsList>

                <TabsContent value="coinbase" className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Coinbase Commerce</strong> - Best for beginners
                      <ul className="list-disc ml-5 mt-2 text-sm">
                        <li>FREE - no fees</li>
                        <li>Supports: BTC, ETH, USDC, USDT, DOGE, more</li>
                        <li>Easy setup - 10 minutes</li>
                        <li>Hosted checkout page</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyCode(coinbaseCommerceCode, 'coinbase')}
                    >
                      {copied === 'coinbase' ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied === 'coinbase' ? 'Copied!' : 'Copy'}
                    </Button>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{coinbaseCommerceCode}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="nowpayments" className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>NOWPayments</strong> - Most crypto options
                      <ul className="list-disc ml-5 mt-2 text-sm">
                        <li>100+ cryptocurrencies</li>
                        <li>0.5% fee</li>
                        <li>Auto-convert to USD</li>
                        <li>Recurring payments</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="relative">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyCode(nowPaymentsCode, 'nowpayments')}
                    >
                      {copied === 'nowpayments' ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied === 'nowpayments' ? 'Copied!' : 'Copy'}
                    </Button>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{nowPaymentsCode}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-500">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">💡 My Recommendation</AlertTitle>
            <AlertDescription className="text-green-700">
              <p className="mb-2"><strong>For most users:</strong></p>
              <ol className="list-decimal ml-5 space-y-2">
                <li><strong>Keep Stripe</strong> - Your main payment method (already working!)</li>
                <li><strong>Add Coinbase Commerce</strong> - FREE crypto option for those who prefer it</li>
                <li><strong>Skip PayPal Crypto</strong> - Not available for business use</li>
              </ol>
              <p className="mt-3 text-sm">
                This gives you: Credit cards (Stripe) + Crypto (Coinbase) = Maximum flexibility!
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}