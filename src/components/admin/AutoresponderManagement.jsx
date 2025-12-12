
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Send,
  Users,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Plus // Added Plus icon for new sequence button
} from "lucide-react";

export default function AutoresponderManagement() {
  const [sequences, setSequences] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [viewingSequence, setViewingSequence] = useState(null);

  useEffect(() => {
    loadData();
    loadUserEmail();
  }, []);

  const loadUserEmail = async () => {
    try {
      const user = await base44.auth.me();
      setTestEmail(user.email);
    } catch (error) {
      console.error("Failed to load user email:", error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [seqs, subs, affs] = await Promise.all([
        base44.entities.AutoresponderSequence.list("-created_date", 100), // Fetch all sequences, up to 100
        base44.entities.NewsletterSubscriber.list("-created_date", 1000),
        base44.entities.Affiliate.filter({ status: 'active' })
      ]);
      setSequences(seqs);
      setSubscribers(subs);
      setAffiliates(affs);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
    setIsLoading(false);
  };

  const deleteSequence = async (sequenceId) => {
    if (!window.confirm("Delete this sequence permanently? This cannot be undone.")) return;

    try {
      await base44.entities.AutoresponderSequence.delete(sequenceId);
      setSendStatus({
        type: 'success',
        message: '✅ Sequence deleted! Refreshing data...',
        details: 'You can create a new one from Dashboard → Email Autoresponders.'
      });
      await loadData();
    } catch (error) {
      console.error("Failed to delete sequence:", error);
      setSendStatus({
        type: 'error',
        message: `Failed to delete sequence: ${error.message}`,
        details: 'Please try again.'
      });
    }
  };

  const deleteAllSequences = async () => {
    if (!window.confirm(`Delete ALL ${sequences.length} sequences? This cannot be undone! It is recommended to create new sequences immediately after deleting.`)) return;

    setIsLoading(true); // Show loading during mass deletion
    try {
      for (const seq of sequences) {
        await base44.entities.AutoresponderSequence.delete(seq.id);
      }
      setSendStatus({
        type: 'success',
        message: `✅ Deleted all ${sequences.length} sequences!`,
        details: 'Now go to Dashboard → Email Autoresponders → Create New Sequence to set up updated ones.'
      });
      await loadData(); // Reload data after deletion
    } catch (error) {
      console.error("Failed to delete sequences:", error);
      setSendStatus({
        type: 'error',
        message: `Failed to delete all sequences: ${error.message}`,
        details: 'Please try again.'
      });
    }
    setIsLoading(false);
  };

  // Convert markdown-style content to HTML
  const convertToHTML = (content, subject) => {
    const lines = content.split('\n');
    let html = '';
    let inList = false;
    let listType = null;
    let currentParagraph = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        if (currentParagraph) {
          html += `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #334155;">${currentParagraph}</p>`;
          currentParagraph = '';
        }
        if (inList) {
          html += listType === 'ul' ? '</ul>' : '</ol>';
          inList = false;
          listType = null;
        }
        continue;
      }

      // Bullet point
      if (line.startsWith('-') || line.startsWith('•')) {
        if (currentParagraph) {
          html += `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #334155;">${currentParagraph}</p>`;
          currentParagraph = '';
        }
        if (!inList || listType !== 'ul') {
          if (inList) html += '</ol>';
          html += '<ul style="margin: 0 0 20px 0; padding-left: 24px;">';
          inList = true;
          listType = 'ul';
        }
        const text = line.replace(/^[-•]\s*/, '');
        const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<li style="margin-bottom: 10px; line-height: 1.6; color: #334155;">${formatted}</li>`;
        continue;
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        if (currentParagraph) {
          html += `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #334155;">${currentParagraph}</p>`;
          currentParagraph = '';
        }
        if (!inList || listType !== 'ol') {
          if (inList) html += '</ul>';
          html += '<ol style="margin: 0 0 20px 0; padding-left: 24px;">';
          inList = true;
          listType = 'ol';
        }
        const text = line.replace(/^\d+\.\s*/, '');
        const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `<li style="margin-bottom: 10px; line-height: 1.6; color: #334155;">${formatted}</li>`;
        continue;
      }

      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
        listType = null;
      }

      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      if (currentParagraph) {
        currentParagraph += '<br>' + formatted;
      } else {
        currentParagraph = formatted;
      }
    }

    if (currentParagraph) {
      html += `<p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #334155;">${currentParagraph}</p>`;
    }
    if (inList) {
      html += listType === 'ul' ? '</ul>' : '</ol>';
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 600px;">

          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #F59E0B 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: bold; line-height: 1.3;">
                ${subject.replace(/🎉|💡|📊|🎯|🚀|📬|💬/g, '').trim()}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              ${html}
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                💬 <strong>Questions?</strong> Reply to this email anytime - we're here to help!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${window.location.origin}" style="display: inline-block; margin: 0 10px; color: #3B82F6; text-decoration: none; font-size: 13px; font-weight: 500;">
                      Visit Website
                    </a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="${window.location.origin}/unsubscribe?email={{email}}" style="display: inline-block; margin: 0 10px; color: #94a3b8; text-decoration: none; font-size: 13px;">
                      Unsubscribe
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} CryptoAI Central. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      alert("Please enter an email address");
      return;
    }

    setIsSendingTest(true);
    setSendStatus(null);

    try {
      const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; max-width: 600px;">
          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #F59E0B 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px;">Test Email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #334155;">Hello!</p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #334155;">This is a <strong>test email</strong> to verify your email sending is working correctly.</p>
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; color: #334155;">If you're seeing this with proper formatting, email delivery is functional! ✅</p>
              <p style="margin: 0; font-size: 14px; color: #64748b;">Test sent at: ${new Date().toLocaleString()}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-radius: 0 0 16px 16px;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">CryptoAI Central - ${window.location.origin}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await base44.integrations.Core.SendEmail({
        to: testEmail,
        subject: "✅ Test Email from CryptoAI Central",
        body: htmlBody
      });

      setSendStatus({
        type: 'success',
        message: `Test email sent to ${testEmail}! Check your inbox (and spam folder).`,
        details: 'If formatted correctly, your autoresponders will work the same way.'
      });
    } catch (error) {
      console.error("Test email failed:", error);
      setSendStatus({
        type: 'error',
        message: `Failed: ${error.message}`,
        details: 'Check console for details.'
      });
    }

    setIsSendingTest(false);
  };

  const sendWelcomeSequence = async (affiliateId, sequenceId) => {
    if (subscribers.length === 0) {
      setSendStatus({
        type: 'error',
        message: 'No subscribers found!',
        details: 'Add newsletter subscribers first.'
      });
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      const sequence = sequences.find(s => s.id === sequenceId);
      const affiliate = affiliates.find(a => a.id === affiliateId);

      if (!sequence || !affiliate || !sequence.emails || sequence.emails.length === 0) {
        throw new Error("Invalid sequence or affiliate");
      }

      // Determine sender name and signature
      const isAdmin = affiliate.user_email === 'jdigicoin@gmail.com';
      const senderName = isAdmin ? 'Joe Robertson' : affiliate.user_email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const signature = isAdmin
        ? `Best regards,<br><strong>${senderName}</strong><br><span style="color: #64748b; font-size: 14px;">CEO, CryptoAI Central</span>`
        : `Best regards,<br><strong>${senderName}</strong><br><span style="color: #64748b; font-size: 14px;">CryptoAI Central Team</span>`;

      let successCount = 0;
      let failCount = 0;
      const errors = [];

      const firstEmail = sequence.emails.find(e => e.delay_days === 0) || sequence.emails[0];

      console.log(`Sending to ${subscribers.length} subscribers...`);

      for (const subscriber of subscribers) {
        try {
          const firstName = subscriber.name.split(' ')[0];

          // Replace placeholders in content
          let personalizedContent = firstEmail.content
            .replace(/\{\{first_name\}\}/g, firstName)
            .replace(/\{\{affiliate_name\}\}/g, senderName);

          // Convert to HTML with gradient header
          const htmlBody = convertToHTML(personalizedContent, firstEmail.subject);

          // Replace email placeholder and add proper signature
          let finalHTML = htmlBody.replace(/\{\{email\}\}/g, subscriber.email);

          // Replace the signature in the HTML (find "Best regards" and replace with proper signature)
          finalHTML = finalHTML.replace(
            /Best regards,[\s\S]*?CryptoAI Central Team/g,
            signature
          );

          await base44.integrations.Core.SendEmail({
            to: subscriber.email,
            subject: firstEmail.subject,
            body: finalHTML
          });

          successCount++;
          console.log(`✅ Sent to ${subscriber.email}`);
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`❌ Failed: ${subscriber.email}`, error);
          failCount++;
          errors.push(`${subscriber.email}: ${error.message}`);
        }
      }

      setSendStatus({
        type: successCount > 0 ? 'success' : 'error',
        message: `📧 Sent ${successCount} emails! ${failCount > 0 ? `${failCount} failed.` : ''}`,
        details: `Email: "${firstEmail.subject}" | Signed by: ${senderName}${isAdmin ? ' (CEO)' : ''} | ${sequence.emails.length > 1 ? `${sequence.emails.length - 1} follow-ups scheduled.` : ''}`
      });

      if (errors.length > 0) {
        console.log("Errors:", errors);
      }

    } catch (error) {
      console.error("Send failed:", error);
      setSendStatus({
        type: 'error',
        message: `Failed: ${error.message}`
      });
    }

    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const hasAnyOldFormatSequence = sequences.some(s =>
    s.emails && s.emails.some(e =>
      e.content.includes('Dear Subscriber') ||
      e.content.includes('[Your Name]') ||
      e.content.includes('[Your Position]')
    )
  );

  return (
    <div className="space-y-6">
      {/* Warning Alert for Old Format Sequences */}
      {sequences.length > 0 && hasAnyOldFormatSequence && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800 font-bold">⚠️ Old Format Detected!</AlertTitle>
          <AlertDescription className="text-red-700">
            Some sequences use old template content (e.g., "Dear Subscriber", "[Your Name]", "[Your Position]").
            For best results, delete these and create new sequences with the updated templates.
            <div className="mt-4">
              <Button size="sm" variant="destructive" onClick={deleteAllSequences}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Sequences
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Test Email Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Mail className="w-5 h-5" />
            Test Email Sending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter test email..."
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={sendTestEmail}
              disabled={isSendingTest}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSendingTest ? (
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
        </CardContent>
      </Card>

      {sendStatus && (
        <Alert variant={sendStatus.type === 'success' ? 'default' : 'destructive'}>
          {sendStatus.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{sendStatus.message}</AlertTitle>
          {sendStatus.details && (
            <AlertDescription>{sendStatus.details}</AlertDescription>
          )}
        </Alert>
      )}

      {/* All Autoresponder Sequences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Autoresponder Sequences ({sequences.length})</span>
            <Badge variant="secondary">{subscribers.length} subscribers</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sequences.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-slate-500 mb-4">No sequences found.</p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-900 mb-3">📧 Create Your First Sequence</h4>
                <p className="text-sm text-blue-700 mb-4">
                  Go to the Dashboard to create email autoresponder sequences with the new personalized templates.
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = window.location.origin + '/Dashboard';
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Go to Dashboard → Create Sequence
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sequences.map((seq) => {
                const affiliate = affiliates.find(a => a.id === seq.affiliate_id);

                const hasOldFormat = seq.emails && seq.emails.some(e =>
                  e.content.includes('Dear Subscriber') ||
                  e.content.includes('[Your Name]') ||
                  e.content.includes('[Your Position]')
                );

                const isAdmin = affiliate?.user_email === 'jdigicoin@gmail.com';
                const senderName = affiliate ?
                  (isAdmin ? 'Joe Robertson (CEO)' : affiliate.user_email.split('@')[0])
                  : 'Unknown';

                return (
                  <div key={seq.id} className={`border rounded-lg p-4 space-y-3 ${hasOldFormat ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{seq.name}</h3>
                          {hasOldFormat && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />Old Format
                            </Badge>
                          )}
                          <Badge className="capitalize">{seq.sequence_type}</Badge>
                          {seq.active && <Badge variant="default">Active</Badge>}
                        </div>
                        <p className="text-sm text-slate-600">
                          By: {affiliate ? affiliate.user_email : 'Unknown'} • {seq.emails?.length || 0} emails
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingSequence(viewingSequence === seq.id ? null : seq.id)}
                          title={viewingSequence === seq.id ? "Hide details" : "View details"}
                        >
                          {viewingSequence === seq.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSequence(seq.id)}
                          title="Delete sequence"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Show first email preview */}
                    {seq.emails && seq.emails.length > 0 && viewingSequence === seq.id && (
                      <div className="bg-white rounded p-4 border space-y-3 shadow-inner">
                        {seq.emails.map((email, idx) => (
                          <div key={idx} className="border-b pb-3 last:border-b-0 last:pb-0">
                            <p className="font-semibold text-sm mb-1">
                              Day {email.delay_days}: {email.subject}
                            </p>
                            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 p-2 rounded max-h-32 overflow-y-auto">
                              {email.content.substring(0, 300)}...
                            </pre>
                            {idx === 0 && ( // Add send button for the first email only
                              <Button
                                size="sm"
                                onClick={() => sendWelcomeSequence(affiliate?.id, seq.id)}
                                disabled={isSending || subscribers.length === 0}
                                className="bg-green-600 hover:bg-green-700 mt-2"
                              >
                                {isSending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send First Email to All ({subscribers.length})
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>How to Fix Old Sequences</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Click "Delete All Old Sequences" above</li>
            <li>Go to Dashboard → Email Autoresponders tab</li>
            <li>Click "Create New Sequence"</li>
            <li>The new template uses proper personalization</li>
            <li>Save and activate the sequence</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
