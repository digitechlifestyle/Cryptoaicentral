import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import {
  Mail,
  Users,
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Tag,
  Clock,
  BarChart3
} from "lucide-react";

export default function KitEmailManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Sync All Subscribers State
  const [syncProgress, setSyncProgress] = useState(null);

  // Send Broadcast State
  const [broadcastData, setBroadcastData] = useState({
    subject: "",
    content: "",
    previewText: ""
  });

  // Create Sequence State
  const [sequenceData, setSequenceData] = useState({
    name: "",
    emails: [
      { subject: "", content: "", delay_days: 0 }
    ]
  });

  // Tag Subscriber State
  const [tagData, setTagData] = useState({
    email: "",
    tagName: ""
  });

  // Get Stats State
  const [statsEmail, setStatsEmail] = useState("");
  const [subscriberStats, setSubscriberStats] = useState(null);

  const handleSyncAll = async () => {
    setIsLoading(true);
    setError(null);
    setSyncProgress(null);

    try {
      const { data } = await base44.functions.invoke('kitEmail', {
        action: 'sync_all_subscribers'
      });

      setSyncProgress(data);
      setResult(`✅ Synced ${data.synced} of ${data.total} subscribers to Kit`);
    } catch (err) {
      setError(err.message || 'Failed to sync subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastData.subject || !broadcastData.content) {
      setError('Subject and content are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await base44.functions.invoke('kitEmail', {
        action: 'send_broadcast',
        data: broadcastData
      });

      setResult(`✅ Broadcast sent successfully! ID: ${data.broadcast_id}`);
      setBroadcastData({ subject: "", content: "", previewText: "" });
    } catch (err) {
      setError(err.message || 'Failed to send broadcast');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSequence = async () => {
    if (!sequenceData.name || sequenceData.emails.length === 0) {
      setError('Sequence name and at least one email required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await base44.functions.invoke('kitEmail', {
        action: 'create_sequence',
        data: sequenceData
      });

      setResult(`✅ Sequence created! ID: ${data.sequence_id}`);
      setSequenceData({
        name: "",
        emails: [{ subject: "", content: "", delay_days: 0 }]
      });
    } catch (err) {
      setError(err.message || 'Failed to create sequence');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagSubscriber = async () => {
    if (!tagData.email || !tagData.tagName) {
      setError('Email and tag name are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await base44.functions.invoke('kitEmail', {
        action: 'tag_subscriber',
        data: tagData
      });

      setResult(`✅ ${data.message}`);
      setTagData({ email: "", tagName: "" });
    } catch (err) {
      setError(err.message || 'Failed to tag subscriber');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStats = async () => {
    if (!statsEmail) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSubscriberStats(null);

    try {
      const { data } = await base44.functions.invoke('kitEmail', {
        action: 'get_subscriber_stats',
        data: { email: statsEmail }
      });

      setSubscriberStats(data);
    } catch (err) {
      setError(err.message || 'Failed to get stats');
    } finally {
      setIsLoading(false);
    }
  };

  const addEmailToSequence = () => {
    setSequenceData({
      ...sequenceData,
      emails: [
        ...sequenceData.emails,
        { subject: "", content: "", delay_days: sequenceData.emails.length }
      ]
    });
  };

  const removeEmailFromSequence = (index) => {
    setSequenceData({
      ...sequenceData,
      emails: sequenceData.emails.filter((_, i) => i !== index)
    });
  };

  const updateSequenceEmail = (index, field, value) => {
    const newEmails = [...sequenceData.emails];
    newEmails[index] = { ...newEmails[index], [field]: value };
    setSequenceData({ ...sequenceData, emails: newEmails });
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Mail className="w-7 h-7 text-purple-600" />
          Kit Email Management
        </CardTitle>
        <CardDescription>
          Manage your email subscribers, campaigns, and automation with Kit (ConvertKit)
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">{result}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="sync" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sync">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync
            </TabsTrigger>
            <TabsTrigger value="broadcast">
              <Send className="w-4 h-4 mr-2" />
              Broadcast
            </TabsTrigger>
            <TabsTrigger value="sequence">
              <Clock className="w-4 h-4 mr-2" />
              Sequences
            </TabsTrigger>
            <TabsTrigger value="tags">
              <Tag className="w-4 h-4 mr-2" />
              Tags
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>

          {/* SYNC TAB */}
          <TabsContent value="sync" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Sync All Subscribers to Kit
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  This will sync all subscribers from your database to Kit. Existing subscribers will be updated.
                </p>
                <Button
                  onClick={handleSyncAll}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync All to Kit
                    </>
                  )}
                </Button>
              </div>

              {syncProgress && (
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold mb-3">Sync Results</h4>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{syncProgress.synced}</div>
                      <div className="text-xs text-slate-600">Synced</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{syncProgress.failed}</div>
                      <div className="text-xs text-slate-600">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{syncProgress.total}</div>
                      <div className="text-xs text-slate-600">Total</div>
                    </div>
                  </div>
                  {syncProgress.errors && syncProgress.errors.length > 0 && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      <strong>Errors:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {syncProgress.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* BROADCAST TAB */}
          <TabsContent value="broadcast" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="broadcast-subject">Subject Line</Label>
                <Input
                  id="broadcast-subject"
                  value={broadcastData.subject}
                  onChange={(e) => setBroadcastData({ ...broadcastData, subject: e.target.value })}
                  placeholder="Your weekly crypto update"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="broadcast-preview">Preview Text (Optional)</Label>
                <Input
                  id="broadcast-preview"
                  value={broadcastData.previewText}
                  onChange={(e) => setBroadcastData({ ...broadcastData, previewText: e.target.value })}
                  placeholder="Short preview that appears in inbox"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="broadcast-content">Email Content (HTML)</Label>
                <Textarea
                  id="broadcast-content"
                  value={broadcastData.content}
                  onChange={(e) => setBroadcastData({ ...broadcastData, content: e.target.value })}
                  placeholder="<h1>Hello!</h1><p>Your email content here...</p>"
                  rows={12}
                  className="mt-2 font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleSendBroadcast}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Broadcast...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Broadcast to All Subscribers
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* SEQUENCE TAB */}
          <TabsContent value="sequence" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="sequence-name">Sequence Name</Label>
                <Input
                  id="sequence-name"
                  value={sequenceData.name}
                  onChange={(e) => setSequenceData({ ...sequenceData, name: e.target.value })}
                  placeholder="Welcome Series"
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <Label>Emails in Sequence</Label>
                {sequenceData.emails.map((email, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Email {index + 1}</Badge>
                      {sequenceData.emails.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmailFromSequence(index)}
                          className="text-red-600"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label>Subject</Label>
                      <Input
                        value={email.subject}
                        onChange={(e) => updateSequenceEmail(index, 'subject', e.target.value)}
                        placeholder="Email subject"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Content (HTML)</Label>
                      <Textarea
                        value={email.content}
                        onChange={(e) => updateSequenceEmail(index, 'content', e.target.value)}
                        placeholder="<p>Email content...</p>"
                        rows={6}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <Label>Delay (days after previous email)</Label>
                      <Input
                        type="number"
                        value={email.delay_days}
                        onChange={(e) => updateSequenceEmail(index, 'delay_days', parseInt(e.target.value) || 0)}
                        min="0"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addEmailToSequence}
                  className="w-full"
                >
                  + Add Another Email
                </Button>
              </div>

              <Button
                onClick={handleCreateSequence}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Sequence...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Create Automated Sequence
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* TAGS TAB */}
          <TabsContent value="tags" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tag-email">Subscriber Email</Label>
                <Input
                  id="tag-email"
                  type="email"
                  value={tagData.email}
                  onChange={(e) => setTagData({ ...tagData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={tagData.tagName}
                  onChange={(e) => setTagData({ ...tagData, tagName: e.target.value })}
                  placeholder="Premium, Engaged, etc."
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleTagSubscriber}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Tagging...
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4 mr-2" />
                    Add Tag to Subscriber
                  </>
                )}
              </Button>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Common Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>Newsletter</Badge>
                  <Badge>Active</Badge>
                  <Badge>Premium</Badge>
                  <Badge>Engaged</Badge>
                  <Badge>New</Badge>
                  <Badge>Inactive</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* STATS TAB */}
          <TabsContent value="stats" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="stats-email">Subscriber Email</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="stats-email"
                    type="email"
                    value={statsEmail}
                    onChange={(e) => setStatsEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleGetStats}
                    disabled={isLoading}
                    className="bg-slate-600 hover:bg-slate-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Get Stats
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {subscriberStats && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Subscriber Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <Badge>{subscriberStats.stats?.state || 'N/A'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Created:</span>
                      <span>{subscriberStats.stats?.created_at ? new Date(subscriberStats.stats.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    {subscriberStats.subscriber && (
                      <div className="mt-4 p-3 bg-slate-50 rounded text-xs">
                        <strong>Raw Data:</strong>
                        <pre className="mt-2 overflow-auto">{JSON.stringify(subscriberStats.subscriber, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-2">📚 Kit Dashboard Access</h4>
          <p className="text-sm text-amber-800 mb-2">
            For advanced analytics, automation rules, and forms, visit your Kit dashboard:
          </p>
          <a
            href="https://app.kit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            → Open Kit Dashboard
          </a>
        </div>
      </CardContent>
    </Card>
  );
}