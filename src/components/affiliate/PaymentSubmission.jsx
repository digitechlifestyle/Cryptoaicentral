
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { CheckCircle, Copy, CreditCard, Wallet, AlertCircle } from "lucide-react";

export default function PaymentSubmission({ affiliate, onPaymentSubmitted }) {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [paymentPlan, setPaymentPlan] = useState("monthly");
  const [transactionId, setTransactionId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState("");

  const handleCopyAddress = (address, currency) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(currency);
    setTimeout(() => setCopiedAddress(""), 2000);
  };

  // PayPal payment links
  const PAYPAL_MONTHLY_LINK = "https://www.paypal.com/ncp/payment/WNJM7LVCYTBDQ";
  const PAYPAL_ANNUAL_LINK = "https://www.paypal.com/ncp/payment/GK24KQLJ8NSN6";

  // ✅ YOUR REAL CRYPTO WALLET ADDRESSES
  const cryptoAddresses = {
    bitcoin: { 
      address: "3PhM9hbdssYBL8t6qZKqT2EtT44bWHrRdT", // ✅ YOUR BTC ADDRESS
      network: "Bitcoin Network", 
      monthlyAmount: "~$9.99 worth of BTC",
      annualAmount: "~$99.99 worth of BTC"
    },
    ethereum: { 
      address: "0x44333f435253d8B79C2945128cB538472F70B092", // ✅ YOUR ETH ADDRESS
      network: "Ethereum (ERC-20)", 
      monthlyAmount: "~$9.99 worth of ETH",
      annualAmount: "~$99.99 worth of ETH"
    },
    usdc: { 
      address: "0x44333f435253d8B79C2945128cB538472F70B092", // ✅ SAME AS ETH (ERC-20)
      network: "Ethereum (ERC-20)", 
      monthlyAmount: "9.99 USDC (exact)",
      annualAmount: "99.99 USDC (exact)"
    },
    usdt: { 
      address: "0x44333f435253d8B79C2945128cB538472F70B092", // ✅ SAME AS ETH (ERC-20)
      network: "Ethereum (ERC-20)", 
      monthlyAmount: "9.99 USDT (exact)",
      annualAmount: "99.99 USDT (exact)"
    },
    stellar: { 
      address: "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37", // ✅ YOUR XLM ADDRESS
      memo: "483135691", // ⚠️ REQUIRED - Must include this memo!
      network: "Stellar Network (XLM)", 
      monthlyAmount: "~$9.99 worth of XLM",
      annualAmount: "~$99.99 worth of XLM"
    },
    rlusd: { 
      address: "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg", // ✅ SAME AS XRP (XRP Ledger)
      tag: "250021006", // ⚠️ REQUIRED - Must include this tag!
      network: "XRP Ledger (RLUSD)", 
      monthlyAmount: "9.99 RLUSD (exact)",
      annualAmount: "99.99 RLUSD (exact)"
    },
    xrp: { 
      address: "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg", // ✅ YOUR XRP ADDRESS
      tag: "250021006", // ⚠️ REQUIRED - Must include this tag!
      network: "XRP Ledger", 
      monthlyAmount: "~$9.99 worth of XRP",
      annualAmount: "~$99.99 worth of XRP"
    },
    hedera: { 
      address: "0.0.1133968", // ✅ YOUR HBAR ADDRESS
      memo: "4256019166", // ⚠️ REQUIRED - Must include this memo!
      network: "Hedera Hashgraph (HBAR)", 
      monthlyAmount: "~$9.99 worth of HBAR",
      annualAmount: "~$99.99 worth of HBAR"
    },
    xdc: { 
      address: "0x5f3a18871b474260c8786648dbc512328147c8b2", // ✅ YOUR XDC ADDRESS
      network: "XDC Network", 
      monthlyAmount: "~$9.99 worth of XDC",
      annualAmount: "~$99.99 worth of XDC"
    },
    solana: { 
      address: "7nANiWg9zGZjEuBogFfgVRCovrH6jEfTyWYbTaj1eMBm", // ✅ YOUR SOL ADDRESS
      network: "Solana", 
      monthlyAmount: "~$9.99 worth of SOL",
      annualAmount: "~$99.99 worth of SOL"
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      setSubmitError("Please enter a transaction ID or PayPal email");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const amount = paymentPlan === "annual" ? 99.99 : 9.99;
      
      await base44.entities.AffiliatePayment.create({
        affiliate_id: affiliate.id,
        user_email: affiliate.user_email,
        amount: amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        wallet_address: walletAddress || null,
        status: "pending",
        notes: notes || null
      });

      setSubmitSuccess(true);
      setTransactionId("");
      setWalletAddress("");
      setNotes("");
      
      if (onPaymentSubmitted) {
        onPaymentSubmitted();
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      setSubmitError("Failed to submit payment. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentAmount = paymentPlan === "annual" ? "$99.99/year" : "$9.99/month";
  const paymentSavings = paymentPlan === "annual" ? "(Save $20/year)" : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Affiliate Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        {submitSuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Payment Submitted!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your payment information has been submitted. Our team will verify it within 24 hours and activate your account.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Plan Selection */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">Choose Your Plan</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${paymentPlan === 'monthly' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                  onClick={() => setPaymentPlan('monthly')}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">Monthly</h3>
                      <Badge>$9.99/mo</Badge>
                    </div>
                    <p className="text-sm text-slate-600">Billed monthly, cancel anytime</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${paymentPlan === 'annual' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'}`}
                  onClick={() => setPaymentPlan('annual')}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">Annual</h3>
                      <Badge className="bg-green-600">$99.99/yr</Badge>
                    </div>
                    <p className="text-sm text-slate-600">Save $20/year - Best value!</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Selected: <strong>{paymentAmount}</strong> {paymentSavings}
            </p>

            <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paypal">
                  <CreditCard className="w-4 h-4 mr-2" />
                  PayPal
                </TabsTrigger>
                <TabsTrigger value="crypto">
                  <Wallet className="w-4 h-4 mr-2" />
                  Cryptocurrency
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paypal" className="space-y-4 mt-4">
                <Alert>
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="font-semibold">PayPal Payment Instructions:</div>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Click the button below to open PayPal</li>
                        <li>Send exactly <strong>{paymentPlan === 'annual' ? '$99.99 USD' : '$9.99 USD'}</strong></li>
                        <li>Come back and enter your PayPal email or transaction ID</li>
                      </ol>
                      
                      <Button 
                        onClick={() => window.open(paymentPlan === 'annual' ? PAYPAL_ANNUAL_LINK : PAYPAL_MONTHLY_LINK, '_blank')}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.124 9.124 0 0 1-.535 3.007c-1.316 4.59-5.017 5.814-9.304 5.814H9.174L7.951 21.337H13.557a.641.641 0 0 0 .633-.74l.034-.22.649-4.118.042-.272a.641.641 0 0 1 .633-.544h.398c3.66 0 6.526-1.487 7.36-5.795.347-1.797.168-3.296-.644-4.218a3.47 3.47 0 0 0-.496-.427z"/>
                        </svg>
                        Pay with PayPal - {paymentPlan === 'annual' ? '$99.99' : '$9.99'}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="paypal-email">Your PayPal Email or Transaction ID</Label>
                  <Input
                    id="paypal-email"
                    placeholder="your.email@example.com or transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="crypto" className="space-y-4 mt-4">
                <Alert className="bg-blue-50 border-blue-500">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm">
                    <div className="space-y-2">
                      <p className="font-bold text-blue-900">
                        📍 You selected: {paymentPlan === 'annual' ? 'ANNUAL ($99.99/year)' : 'MONTHLY ($9.99/month)'}
                      </p>
                      <p>Send <strong>EXACTLY {paymentPlan === 'annual' ? '$99.99 worth' : '$9.99 worth'}</strong> of cryptocurrency to one of the addresses below.</p>
                      <p className="text-xs">⚠️ These are NOT PayPal addresses - send crypto directly from your wallet.</p>
                      <p className="text-xs">💡 For stablecoins (USDC, USDT, RLUSD): Send exact amount shown</p>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Plan Reminder */}
                <Card className={`border-2 ${paymentPlan === 'annual' ? 'border-purple-500 bg-purple-50' : 'border-blue-500 bg-blue-50'}`}>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-2">Current Selection:</p>
                      <Badge className={`text-lg px-4 py-2 ${paymentPlan === 'annual' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                        {paymentPlan === 'annual' ? '📅 ANNUAL - $99.99/year' : '📅 MONTHLY - $9.99/month'}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-2">
                        Want to change? Click the plan selector above
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {Object.entries(cryptoAddresses).map(([crypto, data]) => (
                    <div key={crypto} className="bg-slate-50 p-3 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold capitalize">{crypto === 'usdc' ? 'USD Coin (USDC)' : crypto === 'usdt' ? 'Tether (USDT)' : crypto === 'rlusd' ? 'Ripple USD (RLUSD)' : crypto}</p>
                          <p className="text-xs text-slate-600">
                            {data.network} • <strong className="text-green-600">{paymentPlan === 'annual' ? data.annualAmount : data.monthlyAmount}</strong>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyAddress(data.address, crypto)}
                          className="text-xs"
                        >
                          {copiedAddress === crypto ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                          {copiedAddress === crypto ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <p className="text-xs font-mono break-all">
                          {data.address.includes('GET_YOUR_') ? (
                            <span className="text-red-600">⚠️ Admin: Replace with real wallet address</span>
                          ) : (
                            data.address
                          )}
                        </p>
                      </div>
                      
                      {/* Show Memo/Tag for Stellar, Hedera, and XRP */}
                      {(data.memo || data.tag) && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-red-600">⚠️ {data.memo ? 'MEMO' : 'DESTINATION TAG'} REQUIRED:</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyAddress(data.memo || data.tag, `${crypto}-${data.memo ? 'memo' : 'tag'}`)}
                              className="text-xs h-6"
                            >
                              {copiedAddress === `${crypto}-${data.memo ? 'memo' : 'tag'}` ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                              {copiedAddress === `${crypto}-${data.memo ? 'memo' : 'tag'}` ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                          <div className="bg-yellow-50 p-2 rounded border border-yellow-300">
                            <p className="text-xs font-mono break-all text-yellow-900">{data.memo || data.tag}</p>
                          </div>
                          <p className="text-xs text-red-600 mt-1">⚠️ Payment will be LOST without this {data.memo ? 'memo' : 'tag'}!</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tx-id">Transaction Hash/ID *</Label>
                  <Input
                    id="tx-id"
                    placeholder="0x... or transaction hash"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet">Your Wallet Address (Optional)</Label>
                  <Input
                    id="wallet"
                    placeholder="Your sending wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 mt-4">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {submitError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmitPayment}
              disabled={isSubmitting || !transactionId.trim()}
              className="w-full mt-4"
            >
              {isSubmitting ? "Submitting..." : "Submit Payment for Verification"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              After submitting, our team will verify your payment within 24 hours and activate your account.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
