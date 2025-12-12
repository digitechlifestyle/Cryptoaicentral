import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function CoinbasePaymentButton({ affiliate, plan = 'monthly' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCoinbasePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Call your backend function to create Coinbase Commerce charge
      const response = await fetch(`${window.location.origin}/.netlify/functions/coinbase-commerce/create-charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId: affiliate.id,
          userEmail: affiliate.user_email,
          plan: plan
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Coinbase Commerce checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Failed to create payment session');
      }
    } catch (err) {
      console.error('Coinbase payment error:', err);
      setError('Coinbase Commerce integration not set up yet. Please use PayPal or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleCoinbasePayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading Checkout...
          </>
        ) : (
          <>
            🪙 Pay with Cryptocurrency
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-center text-slate-600">
        <p>Accepts: BTC, ETH, USDC, USDT, DOGE, and more</p>
        <p className="mt-1">✅ Zero fees • Hosted by Coinbase</p>
      </div>
    </div>
  );
}