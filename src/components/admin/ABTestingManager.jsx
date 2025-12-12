import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TestTube2, TrendingUp, Send, Loader2 } from "lucide-react";

export default function ABTestingManager() {
  const [tests, setTests] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [newTest, setNewTest] = useState({
    campaign_name: "",
    variant_a_subject: "",
    variant_b_subject: "",
    content: "",
    test_size_percentage: 20
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [testData, subData] = await Promise.all([
        base44.entities.ABTestCampaign.list("-created_date", 100),
        base44.entities.NewsletterSubscriber.list("-created_date", 10000)
      ]);
      setTests(testData);
      setSubscribers(subData);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const startTest = async () => {
    if (!newTest.campaign_name || !newTest.variant_a_subject || !newTest.variant_b_subject || !newTest.content) {
      alert("Please fill in all fields");
      return;
    }

    if (!confirm(`Start A/B test with ${newTest.test_size_percentage}% of subscribers (${Math.floor(subscribers.length * newTest.test_size_percentage / 100)} emails)?`)) {
      return;
    }

    setIsSending(true);
    try {
      // Create test campaign
      const testCampaign = await base44.entities.ABTestCampaign.create(newTest);

      // Calculate test size
      const testSize = Math.floor(subscribers.length * newTest.test_size_percentage / 100);
      const halfSize = Math.floor(testSize / 2);

      // Shuffle and split subscribers
      const shuffled = [...subscribers].sort(() => Math.random() - 0.5);
      const groupA = shuffled.slice(0, halfSize);
      const groupB = shuffled.slice(halfSize, testSize);

      // Send variant A
      for (const sub of groupA) {
        const firstName = sub.name.split(' ')[0];
        const personalizedContent = newTest.content.replace(/\{\{first_name\}\}/g, firstName);

        await base44.integrations.Core.SendEmail({
          to: sub.email,
          subject: newTest.variant_a_subject,
          body: personalizedContent
        });
      }

      // Send variant B
      for (const sub of groupB) {
        const firstName = sub.name.split(' ')[0];
        const personalizedContent = newTest.content.replace(/\{\{first_name\}\}/g, firstName);

        await base44.integrations.Core.SendEmail({
          to: sub.email,
          subject: newTest.variant_b_subject,
          body: personalizedContent
        });
      }

      // Update test campaign
      await base44.entities.ABTestCampaign.update(testCampaign.id, {
        status: "testing",
        variant_a_sent: groupA.length,
        variant_b_sent: groupB.length
      });

      alert(`✅ A/B test started! Sent to ${testSize} subscribers.`);
      setShowForm(false);
      setNewTest({ campaign_name: "", variant_a_subject: "", variant_b_subject: "", content: "", test_size_percentage: 20 });
      loadData();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to start test");
    }
    setIsSending(false);
  };

  const calculateWinner = (test) => {
    const aOpenRate = test.variant_a_sent > 0 ? (test.variant_a_opens / test.variant_a_sent) * 100 : 0;
    const bOpenRate = test.variant_b_sent > 0 ? (test.variant_b_opens / test.variant_b_sent) * 100 : 0;

    if (Math.abs(aOpenRate - bOpenRate) < 2) return "tie";
    return aOpenRate > bOpenRate ? "a" : "b";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">A/B Testing</h3>
          <p className="text-sm text-slate-600">Test subject lines to find what works best</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <TestTube2 className="w-4 h-4 mr-2" />
          New A/B Test
        </Button>
      </div>

      {/* Create Test Form */}
      {showForm && (
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle>Create New A/B Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Campaign Name</label>
              <Input
                placeholder="e.g., January Newsletter Test"
                value={newTest.campaign_name}
                onChange={(e) => setNewTest({...newTest, campaign_name: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject Line A</label>
                <Input
                  placeholder="First variant..."
                  value={newTest.variant_a_subject}
                  onChange={(e) => setNewTest({...newTest, variant_a_subject: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject Line B</label>
                <Input
                  placeholder="Second variant..."
                  value={newTest.variant_b_subject}
                  onChange={(e) => setNewTest({...newTest, variant_b_subject: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Test Size: {newTest.test_size_percentage}% ({Math.floor(subscribers.length * newTest.test_size_percentage / 100)} subscribers)</label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={newTest.test_size_percentage}
                onChange={(e) => setNewTest({...newTest, test_size_percentage: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email Content (same for both)</label>
              <Textarea
                placeholder="Email content..."
                value={newTest.content}
                onChange={(e) => setNewTest({...newTest, content: e.target.value})}
                rows={10}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={startTest} disabled={isSending} className="flex-1">
                {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Start A/B Test
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      <div className="space-y-4">
        {tests.map((test) => {
          const winner = calculateWinner(test);
          const aOpenRate = test.variant_a_sent > 0 ? ((test.variant_a_opens / test.variant_a_sent) * 100).toFixed(1) : 0;
          const bOpenRate = test.variant_b_sent > 0 ? ((test.variant_b_opens / test.variant_b_sent) * 100).toFixed(1) : 0;

          return (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{test.campaign_name}</CardTitle>
                  <Badge variant={test.status === 'completed' ? 'default' : 'secondary'}>
                    {test.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Variant A */}
                  <div className={`p-4 rounded-lg border-2 ${winner === 'a' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Variant A</Badge>
                      {winner === 'a' && <Badge className="bg-green-600">Winner 🏆</Badge>}
                    </div>
                    <p className="font-medium text-sm mb-3">{test.variant_a_subject}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sent:</span>
                        <span className="font-semibold">{test.variant_a_sent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opens:</span>
                        <span className="font-semibold">{test.variant_a_opens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Open Rate:</span>
                        <span className="font-semibold text-blue-600">{aOpenRate}%</span>
                      </div>
                    </div>
                    <Progress value={parseFloat(aOpenRate)} className="mt-3 h-2" />
                  </div>

                  {/* Variant B */}
                  <div className={`p-4 rounded-lg border-2 ${winner === 'b' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Variant B</Badge>
                      {winner === 'b' && <Badge className="bg-green-600">Winner 🏆</Badge>}
                    </div>
                    <p className="font-medium text-sm mb-3">{test.variant_b_subject}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sent:</span>
                        <span className="font-semibold">{test.variant_b_sent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Opens:</span>
                        <span className="font-semibold">{test.variant_b_opens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Open Rate:</span>
                        <span className="font-semibold text-blue-600">{bOpenRate}%</span>
                      </div>
                    </div>
                    <Progress value={parseFloat(bOpenRate)} className="mt-3 h-2" />
                  </div>
                </div>

                {winner === 'tie' && (
                  <div className="text-center p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      📊 Results are too close to call! Consider running a longer test.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {tests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <TestTube2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No A/B tests yet. Create your first one!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}