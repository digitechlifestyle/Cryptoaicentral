import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !name) {
      setMessage("Please fill in all fields");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // 1. Save to database
      await base44.entities.NewsletterSubscriber.create({
        name,
        email
      });

      // 2. Auto-sync to Kit
      try {
        await base44.functions.invoke('kitEmail', {
          action: 'sync_subscriber',
          data: {
            email: email,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            tags: ['Website Signup', 'CryptoAI Central']
          }
        });
      } catch (kitError) {
        console.error('Kit sync failed (non-critical):', kitError);
        // Don't fail the whole signup if Kit sync fails
      }

      setStatus("success");
      setMessage("Success! Check your email for confirmation.");
      setEmail("");
      setName("");

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Stay Updated</h3>
          <p className="text-blue-100">Get the latest crypto & AI insights</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "loading"}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-white text-blue-600 hover:bg-blue-50"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Subscribed!
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>

      {message && (
        <p className={`mt-3 text-sm ${status === "error" ? "text-red-200" : "text-green-200"}`}>
          {message}
        </p>
      )}

      <p className="text-xs text-blue-200 mt-4">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}