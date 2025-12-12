import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';

export default function StripeIntegrationDocs() {
  const [copied, setCopied] = useState(false);

  const integrationPrompt = `# Stripe Checkout Integration

This integration enables Stripe payment processing for subscription-based payments, specifically designed for the affiliate program on CryptoAI Central.

## Features
- Create Stripe checkout sessions for monthly and annual subscriptions
- Secure payment processing via Stripe
- Automatic subscription management
- Webhook handling for payment confirmations

## Required Environment Variables
- STRIPE_SECRET_KEY: Your Stripe secret API key (sk_test_... or sk_live_...)
- APP_URL: Your application's base URL (e.g., https://your-app.base44.app)
- STRIPE_WEBHOOK_SECRET: Your Stripe webhook signing secret (whsec_...)

## Endpoints
- POST /create-session - Create a new checkout session
- POST /webhook - Handle Stripe webhook events

## Parameters for /create-session
- affiliateId (string, required): The ID of the affiliate signing up
- userEmail (string, required): The user's email address
- plan (string, optional): Either "monthly" or "annual" (defaults to "monthly")

## Response
Returns a JSON object with:
- sessionId: The Stripe checkout session ID
- url: The redirect URL for the Stripe checkout page`;

  const implementationGuide = `# Implementation Guide for Stripe Checkout Integration

## 1. Prerequisites

Before using this integration, ensure you have:
- A Stripe account (https://stripe.com)
- Your Stripe API keys (test and/or live)
- Backend functions enabled on base44

## 2. Setup Steps

### Step 1: Configure Environment Variables

In your integration settings, add these environment variables:

\`\`\`
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
APP_URL=https://your-app.base44.app
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
\`\`\`

**Getting your Stripe keys:**
1. Go to Stripe Dashboard → Developers → API keys
2. Copy your "Secret key" (starts with sk_test_ or sk_live_)
3. For webhooks, go to Developers → Webhooks → Add endpoint
4. Use URL: https://your-app.base44.app/api/stripe-checkout/webhook
5. Select events: checkout.session.completed, customer.subscription.updated
6. Copy the "Signing secret" (starts with whsec_)

### Step 2: Add Function Code

Create a new function in this integration called "CreateCheckoutSession" with this code:

\`\`\`javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const { httpMethod, body, path } = event;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (httpMethod === 'POST' && path.includes('/create-session')) {
    try {
      const data = JSON.parse(body);
      const { affiliateId, userEmail, plan = 'monthly' } = data;

      if (!affiliateId || !userEmail) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Missing affiliateId or userEmail' })
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
        success_url: \`\${process.env.APP_URL}/Dashboard?tab=affiliate&payment=success\`,
        cancel_url: \`\${process.env.APP_URL}/AffiliateProgram?payment=cancelled\`,
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
};
\`\`\`

## 3. Usage in Your App

### Frontend Code Example

\`\`\`javascript
import { base44 } from '@/api/base44Client';

// When user clicks "Subscribe" button
const handleSubscribe = async (affiliateId, userEmail, plan) => {
  try {
    const response = await fetch('/api/stripe-checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        affiliateId: affiliateId,
        userEmail: userEmail,
        plan: plan // 'monthly' or 'annual'
      })
    });

    const data = await response.json();
    
    if (data.url) {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } else {
      throw new Error('Failed to create checkout session');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Failed to start payment. Please try again.');
  }
};
\`\`\`

## 4. Testing

### Test Mode
Use test credit cards from Stripe:
- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002
- Requires authentication: 4000 0025 0000 3155

### Test Workflow
1. Trigger the checkout flow in your app
2. Use a test card number
3. Complete the checkout
4. Verify you're redirected to success_url
5. Check Stripe Dashboard for the payment

## 5. Going Live

1. Replace test API keys with live keys:
   - sk_live_... instead of sk_test_...
   - pk_live_... instead of pk_test_...
2. Update webhook endpoint to use live mode
3. Test with a real card (small amount)
4. Monitor Stripe Dashboard for issues

## 6. Webhook Handling

To automatically activate affiliates after payment, you can extend the function to handle webhooks:

\`\`\`javascript
// Add this to handle webhook events
if (httpMethod === 'POST' && path.includes('/webhook')) {
  const sig = event.headers['stripe-signature'];
  
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      const { affiliateId } = session.metadata;
      
      // Update affiliate status to 'active' in your database
      console.log('Payment successful for affiliate:', affiliateId);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
  }
}
\`\`\`

## 7. Pricing

- Monthly: $19.99/month
- Annual: $199.99/year

To change pricing, modify the unit_amount values in the code:
- Monthly: 1999 (= $19.99 in cents)
- Annual: 19999 (= $199.99 in cents)

## 8. Support

For issues:
- Check Stripe Dashboard logs
- Verify environment variables are set correctly
- Test with Stripe test mode first
- Contact base44 support via the Feedback button

## 9. Security Notes

- Never expose your secret key (sk_...) in frontend code
- Always use HTTPS in production
- Validate webhook signatures
- Use Row-Level Security on sensitive entities
- Keep Stripe.js library up to date`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integration Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={integrationPrompt}
            readOnly
            className="font-mono text-xs h-64"
          />
          <Button onClick={() => handleCopy(integrationPrompt)} variant="outline">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy Integration Prompt
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={implementationGuide}
            readOnly
            className="font-mono text-xs h-96"
          />
          <Button onClick={() => handleCopy(implementationGuide)} variant="outline">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy Implementation Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}