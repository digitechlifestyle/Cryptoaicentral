
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Mail, Users, Send, Sparkles, Loader2, Plus, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import EmailTestingPanel from "./EmailTestingPanel";
import EmailScheduleViewer from "./EmailScheduleViewer";

export default function EmailMarketingPanel({ affiliate }) {
  const [subscribers, setSubscribers] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const isPaidAffiliate = affiliate.status === 'active';
  const monthlyEmailLimit = isPaidAffiliate ? 5000 : 50;
  const remainingEmails = monthlyEmailLimit - sentCount;

  // Get affiliate's name for email signature
  const affiliateName = affiliate.user_email.split('@')[0].replace(/[._-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.NewsletterSubscriber.list("-created_date", 1000);
      setSubscribers(data);
    } catch (error) {
      console.error("Error loading subscribers:", error);
    }
    setIsLoading(false);
  };

  const generateEmailContent = async (topic) => {
    if (!isPaidAffiliate) {
      alert('AI email generation is available for paid affiliates only.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a professional email newsletter about "${topic}" for a crypto and AI audience.

        IMPORTANT FORMATTING REQUIREMENTS:
        1. Start with "Dear {{first_name}}," (use this exact placeholder)
        2. Write 4-6 SHORT paragraphs (2-3 sentences each)
        3. Add a blank line between EVERY paragraph
        4. Keep paragraphs concise and readable
        5. End with signature: "Best Regards,\\n${affiliateName}"
        
        Content should be:
        - Informative and valuable
        - Easy to read with clear paragraph breaks
        - Professional but conversational tone
        - Include a clear call-to-action
        - Around 300-400 words total
        
        Return as JSON with 'subject' and 'content' fields.
        The content MUST have proper paragraph spacing with \\n\\n between paragraphs.`,
        response_json_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            content: { type: "string" }
          }
        }
      });

      setEmailSubject(response.subject);
      setEmailContent(response.content);
    } catch (error) {
      console.error('Email generation failed:', error);
      alert('Failed to generate email. Please try again.');
    }
    setIsGenerating(false);
  };

  const sendNewsletter = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      alert('Please fill in both subject and content.');
      return;
    }

    if (remainingEmails <= 0) {
      alert('Monthly email limit reached. Upgrade or wait for next month.');
      return;
    }

    if (!window.confirm(`Send newsletter to ${subscribers.length} subscribers?`)) {
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const batchSize = 10;
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        const emailPromises = batch.map(async (subscriber) => {
          try {
            // Personalize email content
            const firstName = subscriber.name.split(' ')[0];
            const personalizedContent = emailContent
              .replace(/\{\{first_name\}\}/g, firstName)
              .replace(/\{\{affiliate_name\}\}/g, affiliateName);

            await base44.integrations.Core.SendEmail({
              to: subscriber.email,
              subject: emailSubject,
              body: personalizedContent + `\n\n---\nUnsubscribe: ${window.location.origin}/unsubscribe?email=${subscriber.email}`
            });
            successCount++;
          } catch (error) {
            console.error(`Failed to send to ${subscriber.email}:`, error);
            failCount++;
          }
        });

        await Promise.all(emailPromises);
        
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setSentCount(prev => prev + successCount);
      alert(`Newsletter sent! Success: ${successCount}, Failed: ${failCount}`);
      
      setEmailSubject('');
      setEmailContent('');
    } catch (error) {
      console.error('Newsletter sending failed:', error);
      alert('Failed to send newsletter. Please try again.');
    }
    setIsSending(false);
  };

  const emailTopics = [
    "Weekly Crypto Market Analysis",
    "Latest DeFi Protocol Updates",
    "AI Trading Bot Performance Review",
    "New Blockchain Technology Trends",
    "Crypto Tax Season Preparation",
    "Security Best Practices for DeFi",
    "Portfolio Rebalancing Strategies",
    "Upcoming ICOs and Token Launches"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-green-600" />
            Email Marketing
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Send newsletters and marketing emails to subscribers.
            </p>
            <div className="flex gap-4">
              <Badge variant="outline">
                <Users className="w-3 h-3 mr-1" />
                {subscribers.length} subscribers
              </Badge>
              <Badge variant={isPaidAffiliate ? "default" : "secondary"}>
                {remainingEmails} emails remaining
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isPaidAffiliate && (
            <Alert>
              <AlertDescription>
                Free tier: 50 emails/month. Upgrade to paid affiliate for 5,000 emails/month + AI content generation.
              </AlertDescription>
            </Alert>
          )}

          {/* Personalization Info */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Personalization Tokens:</strong> Use <code className="bg-blue-100 px-1 rounded">{"{{first_name}}"}</code> for recipient's first name and <code className="bg-blue-100 px-1 rounded">{"{{affiliate_name}}"}</code> for your name ({affiliateName})
            </AlertDescription>
          </Alert>

          {/* Quick Topic Generation */}
          {isPaidAffiliate && (
            <div>
              <h3 className="font-semibold mb-3">AI Email Generation</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {emailTopics.map((topic, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    size="sm"
                    onClick={() => generateEmailContent(topic)}
                    disabled={isGenerating}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
              <Input 
                placeholder="Or enter custom topic..."
                onKeyPress={(e) => e.key === 'Enter' && e.target.value && generateEmailContent(e.target.value)}
                className="mb-2"
              />
            </div>
          )}

          {/* Email Composer */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Subject Line
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email subject..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
                {isPaidAffiliate && (
                  <Button 
                    variant="outline"
                    onClick={() => generateEmailContent('crypto market update')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Email Content
              </label>
              <Textarea
                placeholder={`Dear {{first_name}},\n\nYour first paragraph here...\n\nAdd links: https://example.com\n\nSecond paragraph...\n\nBest Regards,\n${affiliateName}`}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="h-64 font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                💡 Tips: Add blank lines between paragraphs | Use <code className="inline">{"{{first_name}}"}</code> for personalization | Paste links directly: https://example.com
              </p>
            </div>

            {/* Email Testing Panel */}
            {emailSubject && emailContent && (
              <EmailTestingPanel
                emailSubject={emailSubject}
                emailContent={emailContent}
                affiliateName={affiliateName}
              />
            )}

            <Button 
              onClick={sendNewsletter}
              disabled={isSending || remainingEmails <= 0 || !emailSubject.trim() || !emailContent.trim()}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending to {subscribers.length} subscribers...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Newsletter ({subscribers.length} recipients)
                </>
              )}
            </Button>
          </div>

          {/* Email Statistics */}
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{subscribers.length}</div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{sentCount}</div>
                <p className="text-sm text-muted-foreground">Emails Sent This Month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{remainingEmails}</div>
                <p className="text-sm text-muted-foreground">Remaining Emails</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Email Schedule Viewer */}
      <EmailScheduleViewer affiliate={affiliate} />
    </div>
  );
}
