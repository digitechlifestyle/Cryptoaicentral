import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AutoresponderPanel({ affiliateId }) {
  const [sequences, setSequences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [affiliate, setAffiliate] = useState(null);
  
  const [newSequence, setNewSequence] = useState({
    name: "",
    sequence_type: "welcome",
    emails: []
  });

  useEffect(() => {
    loadData();
  }, [affiliateId]);

  const loadData = async () => {
    try {
      const seqs = await base44.entities.AutoresponderSequence.filter({ affiliate_id: affiliateId });
      const aff = await base44.entities.Affiliate.filter({ id: affiliateId });
      setSequences(seqs || []);
      setAffiliate(aff[0]);
    } catch (error) {
      console.error("Error:", error);
      setSequences([]);
    }
    setIsLoading(false);
  };

  const handleGenerateClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!newSequence.name) {
      alert("Please enter a sequence name");
      return;
    }

    setIsGenerating(true);

    try {
      const isAdmin = affiliate?.user_email === 'jdigicoin@gmail.com';
      const senderName = isAdmin ? 'Joe Robertson' : affiliate.user_email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const senderTitle = isAdmin ? 'CEO of Crypto AI Central' : 'Crypto AI Central Team';

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a ${newSequence.sequence_type} email autoresponder sequence for Crypto AI Central - a crypto and AI tools directory.

CRITICAL FORMATTING REQUIREMENTS:
1. Start EVERY email with: "Dear {{first_name}},"
2. Write 4-6 SHORT paragraphs (2-3 sentences each)
3. Use professional, conversational tone
4. End with: "Best regards,\n${senderName}\n${senderTitle}"
5. NO placeholders like [Your Name] - use actual names provided

Generate 5 emails:
- Email 1 (Day 0): Welcome and introduction
- Email 2 (Day 3): Educational value and tips  
- Email 3 (Day 7): Success stories or case studies
- Email 4 (Day 14): Advanced strategies
- Email 5 (Day 21): Special offer or call-to-action

Each email must have:
- Compelling subject line (50 chars max)
- 200-300 words content
- Clear call-to-action
- Proper greeting and signature as specified above

Return as JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            emails: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  subject: { type: "string" },
                  content: { type: "string" },
                  delay_days: { type: "number" }
                }
              }
            }
          }
        }
      });

      if (result?.emails && result.emails.length > 0) {
        setNewSequence({ ...newSequence, emails: result.emails });
        alert(`✅ Generated ${result.emails.length} emails with personalized formatting!`);
      } else {
        alert("No emails generated. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate. Please try again.");
    }

    setIsGenerating(false);
  };

  const saveSequence = async () => {
    if (!newSequence.emails?.length) {
      alert("Generate emails first");
      return;
    }

    try {
      await base44.entities.AutoresponderSequence.create({
        affiliate_id: affiliateId,
        name: newSequence.name,
        sequence_type: newSequence.sequence_type,
        emails: newSequence.emails,
        active: false
      });

      alert("✅ Sequence saved successfully!");
      setShowForm(false);
      setNewSequence({ name: "", sequence_type: "welcome", emails: [] });
      loadData();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save.");
    }
  };

  const toggleActive = async (sequence) => {
    try {
      await base44.entities.AutoresponderSequence.update(sequence.id, {
        active: !sequence.active
      });
      loadData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteSequence = async (id) => {
    if (!confirm("Delete this sequence?")) return;
    try {
      await base44.entities.AutoresponderSequence.delete(id);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Email Autoresponders</h3>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Sequence
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle>✨ Create New Email Sequence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Sequence Name</Label>
              <Input
                value={newSequence.name}
                onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                placeholder="e.g., Welcome Series"
              />
            </div>

            <div>
              <Label>Sequence Type</Label>
              <Select 
                value={newSequence.sequence_type} 
                onValueChange={(value) => setNewSequence({ ...newSequence, sequence_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Series</SelectItem>
                  <SelectItem value="educational">Educational Content</SelectItem>
                  <SelectItem value="promotional">Promotional Campaign</SelectItem>
                  <SelectItem value="reengagement">Re-engagement Series</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Beautiful Emails...
                </>
              ) : (
                <>
                  ✨ Generate AI Email Sequence
                </>
              )}
            </button>

            {newSequence.emails?.length > 0 && (
              <div className="space-y-4 mt-6">
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">
                    ✅ Generated {newSequence.emails.length} Professional Emails!
                  </h4>
                  <p className="text-sm text-green-700">
                    Each email includes personalized greeting and signature from{' '}
                    {affiliate?.user_email === 'jdigicoin@gmail.com' ? 'Joe Robertson, CEO' : 'your name'}
                  </p>
                </div>
                
                {newSequence.emails.map((email, index) => (
                  <Card key={index} className="bg-white border-2">
                    <CardContent className="pt-4 space-y-3">
                      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 text-white p-4 rounded-lg">
                        <Label className="text-white font-semibold block mb-2">
                          📧 Email {index + 1} - Day {email.delay_days}
                        </Label>
                        <Input
                          value={email.subject}
                          onChange={(e) => {
                            const updated = [...newSequence.emails];
                            updated[index].subject = e.target.value;
                            setNewSequence({ ...newSequence, emails: updated });
                          }}
                          className="bg-white/20 text-white placeholder-white/70 border-white/30 font-semibold"
                          placeholder="Subject line"
                        />
                      </div>
                      <Textarea
                        value={email.content}
                        onChange={(e) => {
                          const updated = [...newSequence.emails];
                          updated[index].content = e.target.value;
                          setNewSequence({ ...newSequence, emails: updated });
                        }}
                        rows={12}
                        className="font-sans"
                        placeholder="Email content..."
                      />
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3">
                  <Button onClick={saveSequence} className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6">
                    <Save className="w-5 h-5 mr-2" />
                    Save Sequence
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setNewSequence({ name: "", sequence_type: "welcome", emails: [] });
                    }}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {sequences.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Your Saved Sequences ({sequences.length})</h4>
          {sequences.map((seq) => (
            <Card key={seq.id} className="border-2">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{seq.name}</h4>
                      <Badge variant={seq.active ? "default" : "secondary"}>
                        {seq.active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {seq.sequence_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {seq.emails?.length || 0} emails in sequence
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(seq)}
                    >
                      {seq.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSequence(seq.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!showForm && sequences.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-slate-500 mb-4">No email sequences yet.</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Sequence
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}