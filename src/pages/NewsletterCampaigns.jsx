
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Mail, Send, Edit, Trash2, Plus, TrendingUp, Eye, MousePointer, Loader2, Users, FileText, Split, Zap } from "lucide-react";
import KitEmailManager from "../components/admin/KitEmailManager";

export default function NewsletterCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const [newCampaign, setNewCampaign] = useState({
    campaign_name: "",
    subject: "",
    content: "",
    scheduled_date: "",
    segment: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [campaignData, subscriberData] = await Promise.all([
        base44.entities.NewsletterCampaign.list("-created_date", 100),
        base44.entities.NewsletterSubscriber.list("-created_date", 10000)
      ]);
      setCampaigns(campaignData);
      setSubscribers(subscriberData);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const generateContent = async (topic) => {
    setIsGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a professional newsletter email about "${topic}" for a crypto and AI audience.

Format:
- Compelling subject line (50 chars max)
- Start with "Dear {{first_name}},"
- 4-5 short paragraphs (2-3 sentences each)
- Include a clear call-to-action
- End with "Best regards,\nJoe Robertson\nCEO of Crypto AI Central"

Content should be informative, engaging, and valuable. Use a professional but friendly tone.

Return as JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            content: { type: "string" }
          }
        }
      });

      setNewCampaign({
        ...newCampaign,
        campaign_name: topic,
        subject: result.subject,
        content: result.content
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate content");
    }
    setIsGenerating(false);
  };

  const saveCampaign = async () => {
    if (!newCampaign.campaign_name || !newCampaign.subject || !newCampaign.content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await base44.entities.NewsletterCampaign.create(newCampaign);
      alert("✅ Campaign saved!");
      setShowForm(false);
      setNewCampaign({ campaign_name: "", subject: "", content: "", scheduled_date: "", segment: "all" });
      loadData();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save campaign");
    }
  };

  const sendCampaign = async (campaign) => {
    if (!confirm(`Send "${campaign.campaign_name}" to ${subscribers.length} subscribers?`)) return;

    setIsSending(true);
    try {
      let targetSubscribers = subscribers;
      
      // Apply segmentation
      if (campaign.segment === "new_subscribers") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        targetSubscribers = subscribers.filter(s => new Date(s.created_date) > oneWeekAgo);
      }

      // Send emails in batches
      const batchSize = 10;
      let sent = 0;
      
      for (let i = 0; i < targetSubscribers.length; i += batchSize) {
        const batch = targetSubscribers.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (subscriber) => {
          const firstName = subscriber.name.split(' ')[0];
          const personalizedContent = campaign.content
            .replace(/\{\{first_name\}\}/g, firstName);

          await base44.integrations.Core.SendEmail({
            to: subscriber.email,
            subject: campaign.subject,
            body: personalizedContent
          });
          sent++;
        }));
        
        if (i + batchSize < targetSubscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      await base44.entities.NewsletterCampaign.update(campaign.id, {
        status: "sent",
        sent_count: sent,
        sent_date: new Date().toISOString()
      });

      alert(`✅ Campaign sent to ${sent} subscribers!`);
      loadData();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send campaign");
    }
    setIsSending(false);
  };

  const deleteCampaign = async (id) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      await base44.entities.NewsletterCampaign.delete(id);
      loadData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-yellow-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Newsletter Campaigns</h1>
            <p className="text-slate-600 mt-2">{subscribers.length} total subscribers</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Sent</p>
                  <p className="text-2xl font-bold">
                    {campaigns.filter(c => c.status === 'sent').length}
                  </p>
                </div>
                <Send className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Open Rate</p>
                  <p className="text-2xl font-bold">
                    {campaigns.length > 0 && campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0) > 0
                      ? Math.round((campaigns.reduce((acc, c) => acc + (c.opened_count || 0), 0) / campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0)) * 100)
                      : 0}%
                  </p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Click Rate</p>
                  <p className="text-2xl font-bold">
                    {campaigns.length > 0 && campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0) > 0
                      ? Math.round((campaigns.reduce((acc, c) => acc + (c.clicked_count || 0), 0) / campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0)) * 100)
                      : 0}%
                  </p>
                </div>
                <MousePointer className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="campaigns">
              <Mail className="w-4 h-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="subscribers">
              <Users className="w-4 h-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="abtesting">
              <Split className="w-4 h-4 mr-2" />
              A/B Testing
            </TabsTrigger>
            <TabsTrigger value="kit">
              <Zap className="w-4 h-4 mr-2" />
              Kit Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            {/* Create Campaign Form */}
            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create New Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Campaign Name</label>
                    <Input
                      placeholder="e.g., Weekly Crypto Update"
                      value={newCampaign.campaign_name}
                      onChange={(e) => setNewCampaign({...newCampaign, campaign_name: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Segment</label>
                      <Select value={newCampaign.segment} onValueChange={(v) => setNewCampaign({...newCampaign, segment: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subscribers ({subscribers.length})</SelectItem>
                          <SelectItem value="new_subscribers">New Subscribers (Last 7 days)</SelectItem>
                          <SelectItem value="engaged">Engaged Users</SelectItem>
                          <SelectItem value="inactive">Inactive Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Schedule (Optional)</label>
                      <Input
                        type="datetime-local"
                        value={newCampaign.scheduled_date}
                        onChange={(e) => setNewCampaign({...newCampaign, scheduled_date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">AI Content Generator</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter topic (e.g., 'DeFi Trends 2025')"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            generateContent(e.target.value);
                          }
                        }}
                      />
                      <Button 
                        onClick={() => {
                          const input = document.querySelector('input[placeholder*="Enter topic"]');
                          if (input.value) generateContent(input.value);
                        }}
                        disabled={isGenerating}
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject Line</label>
                    <Input
                      placeholder="Enter subject..."
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <Textarea
                      placeholder="Email content..."
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                      rows={12}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={saveCampaign} className="flex-1">
                      Save Campaign
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{campaign.campaign_name}</h3>
                          <Badge variant={
                            campaign.status === 'sent' ? 'default' :
                            campaign.status === 'scheduled' ? 'secondary' :
                            'outline'
                          }>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.segment}</Badge>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-3">{campaign.subject}</p>
                        
                        {campaign.status === 'sent' && (
                          <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Send className="w-4 h-4 text-green-600" />
                              <span>{campaign.sent_count} sent</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-purple-600" />
                              <span>{campaign.sent_count > 0 ? `${campaign.opened_count || 0} opened (${Math.round(((campaign.opened_count || 0) / campaign.sent_count) * 100)}%)` : "0 opened (0%)"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MousePointer className="w-4 h-4 text-orange-600" />
                              <span>{campaign.sent_count > 0 ? `${campaign.clicked_count || 0} clicked (${Math.round(((campaign.clicked_count || 0) / campaign.sent_count) * 100)}%)` : "0 clicked (0%)"}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <Button size="sm" onClick={() => sendCampaign(campaign)} disabled={isSending}>
                            <Send className="w-4 h-4 mr-1" />
                            Send Now
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => deleteCampaign(campaign.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {campaigns.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No campaigns yet. Create your first one!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Manage your newsletter subscribers here.</p>
                <p className="text-slate-500 mt-2">Total subscribers: {subscribers.length}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Design and manage your email templates.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abtesting">
            <Card>
              <CardContent className="py-12 text-center">
                <Split className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Experiment with A/B tests for subject lines and content.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NEW KIT TAB */}
          <TabsContent value="kit">
            <KitEmailManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
