import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Trash2, Copy, Sparkles, Loader2 } from "lucide-react";

export default function EmailTemplateLibrary({ onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "newsletter",
    subject: "",
    content: ""
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await base44.entities.EmailTemplate.list("-times_used", 100);
      setTemplates(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const generateTemplate = async (category) => {
    setIsGenerating(true);
    try {
      const prompts = {
        welcome: "Create a warm welcome email for new crypto/AI newsletter subscribers",
        newsletter: "Create a weekly crypto market newsletter template",
        promotional: "Create a promotional email for a crypto product launch",
        announcement: "Create an important platform announcement email",
        educational: "Create an educational email about crypto/AI basics",
        engagement: "Create a re-engagement email for inactive subscribers"
      };

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `${prompts[category] || prompts.newsletter}

Format requirements:
- Subject line (compelling, 50 chars max)
- Start with "Dear {{first_name}},"
- 3-4 short paragraphs
- Use placeholders: {{first_name}}, {{company_name}}, {{link}}
- End with "Best regards,\n{{sender_name}}\n{{sender_title}}"
- Professional, conversational tone

Return as JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            content: { type: "string" }
          }
        }
      });

      setNewTemplate({
        ...newTemplate,
        category: category,
        subject: result.subject,
        content: result.content
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate template");
    }
    setIsGenerating(false);
  };

  const saveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await base44.entities.EmailTemplate.create(newTemplate);
      alert("✅ Template saved!");
      setShowForm(false);
      setNewTemplate({ name: "", category: "newsletter", subject: "", content: "" });
      loadTemplates();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save template");
    }
  };

  const useTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
    
    // Update usage count
    base44.entities.EmailTemplate.update(template.id, {
      times_used: (template.times_used || 0) + 1
    });
  };

  const deleteTemplate = async (id) => {
    if (!confirm("Delete this template?")) return;
    try {
      await base44.entities.EmailTemplate.delete(id);
      loadTemplates();
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
        <h3 className="text-xl font-bold">Email Template Library</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Create Template Form */}
      {showForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Template Name</label>
                <Input
                  placeholder="e.g., Weekly Newsletter"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select 
                  value={newTemplate.category} 
                  onValueChange={(v) => {
                    setNewTemplate({...newTemplate, category: v});
                    generateTemplate(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subject Line</label>
              <Input
                placeholder="Email subject..."
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Email content with placeholders..."
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                rows={12}
              />
              <p className="text-xs text-slate-500 mt-2">
                Use placeholders: first_name, company_name, sender_name, link (wrap in double curly braces)
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={saveTemplate} className="flex-1">
                Save Template
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {template.category}
                  </Badge>
                </div>
                {template.is_system && (
                  <Badge variant="secondary">System</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">{template.subject}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {template.content.substring(0, 100)}...
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Used {template.times_used || 0} times</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => useTemplate(template)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Use Template
                </Button>
                {!template.is_system && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No templates yet. Create your first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}