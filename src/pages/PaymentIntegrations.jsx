import React from "react";
import PayPalSetupGuide from "../components/admin/PayPalSetupGuide";

export default function PaymentIntegrations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete PayPal Setup Guide</h1>
          <p className="text-slate-600">
            Step-by-step instructions to set up all 6 PayPal payment links for your site
          </p>
        </div>

        <PayPalSetupGuide />
      </div>
    </div>
  );
}