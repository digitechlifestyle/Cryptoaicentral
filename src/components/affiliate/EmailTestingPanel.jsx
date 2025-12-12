import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Send, Eye, Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EmailTestingPanel({ emailSubject, emailContent, affiliateName, affiliateEmail }) {
  const [testEmail, setTestEmail] = useState(affiliateEmail || '');
  const [testFirstName, setTestFirstName] = useState('');
  const [testFromName, setTestFromName] = useState(affiliateName);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const generatePreview = () => {
    const firstName = testFirstName || 'Friend';
    const personalizedContent = emailContent
      .replace(/\{\{first_name\}\}/g, firstName)
      .replace(/\{\{affiliate_name\}\}/g, testFromName || affiliateName);
    
    return personalizedContent;
  };

  const sendTestEmail = async () => {
    if (!testEmail.trim()) {
      setSendError('Please enter a test email address');
      return;
    }

    if (!emailSubject.trim() || !emailContent.trim()) {
      setSendError('Email subject and content are required');
      return;
    }

    setIsSending(true);
    setSendSuccess(false);
    setSendError('');
    setDebugInfo('Preparing email...');

    try {
      const personalizedContent = generatePreview();
      
      setDebugInfo('Sending email via base44...');
      
      const result = await base44.integrations.Core.SendEmail({
        to: testEmail,
        subject: `[TEST] ${emailSubject}`,
        body: personalizedContent
      });

      console.log('Email send result:', result);
      setDebugInfo('Email sent successfully! Check your inbox in 1-2 minutes.');
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 10000);
    } catch (error) {
      console.error('Failed to send test email:', error);
      setDebugInfo(`Error: ${error.message || 'Unknown error'}`);
      
      if (error.message?.includes('outside the app')) {
        setSendError(`Cannot send to ${testEmail}. This email must be registered in the app. Try adding yourself as a newsletter subscriber first, or use the email you logged in with: ${affiliateEmail}`);
      } else {
        setSendError(`Failed to send: ${error.message || 'Unknown error'}. Make sure ${testEmail} is a registered user or newsletter subscriber.`);
      }
    }
    setIsSending(false);
  };

  return (
    <Card className="border-blue-500 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Test Your Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50 border-amber-500">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Important: Email Limitations</AlertTitle>
          <AlertDescription className="text-amber-700 text-sm">
            <strong>Emails can ONLY be sent to:</strong>
            <ul className="list-disc ml-5 mt-2">
              <li>Registered users in your app</li>
              <li>Newsletter subscribers</li>
            </ul>
            <p className="mt-2">
              <strong>Your registered email:</strong> {affiliateEmail}
            </p>
            <p className="mt-1 text-xs">
              If test fails, go to your homepage → sign up for newsletter with your email first, then try again.
            </p>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="test-email">Send Test To *</Label>
            <Input
              id="test-email"
              type="email"
              placeholder={affiliateEmail}
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="test-firstname">First Name (for placeholder)</Label>
            <Input
              id="test-firstname"
              placeholder="e.g., Sarah"
              value={testFirstName}
              onChange={(e) => setTestFirstName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>

          <Button 
            onClick={sendTestEmail}
            disabled={isSending || !testEmail.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </>
            )}
          </Button>
        </div>

        {debugInfo && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              {debugInfo}
            </AlertDescription>
          </Alert>
        )}

        {sendSuccess && (
          <Alert className="bg-green-50 border-green-500">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Test email sent to {testEmail}! 
              <br />
              <strong>Check your inbox in 1-2 minutes</strong> (emails may be delayed)
              <br />
              <span className="text-xs">Also check spam/junk folder</span>
            </AlertDescription>
          </Alert>
        )}

        {sendError && (
          <Alert className="bg-red-50 border-red-500">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              {sendError}
            </AlertDescription>
          </Alert>
        )}

        {showPreview && (
          <div>
            <Label className="mb-2 block">📧 Email Preview</Label>
            <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="border-b pb-3 mb-3">
                <p className="text-xs text-slate-500">To: {testEmail}</p>
                <p className="font-semibold text-sm mt-2">Subject: [TEST] {emailSubject}</p>
              </div>
              <div className="whitespace-pre-wrap text-sm">
                {generatePreview()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}