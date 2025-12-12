
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InvokeLLM } from "@/api/integrations";
import { Bot, Sparkles, MessageSquare, Loader2, Copy, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AIToolsPanel({ affiliate }) {
  const [activeAI, setActiveAI] = useState('chatgpt');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Usage limits based on subscription status
  const isPaidAffiliate = affiliate.status === 'active';
  const monthlyLimit = isPaidAffiliate ? 1000 : 10; // Paid: 1000 queries, Free: 10 queries
  const remainingUses = monthlyLimit - usageCount;

  const aiTools = [
    {
      id: 'chatgpt',
      name: 'ChatGPT-4',
      description: 'Advanced conversational AI for content creation, analysis, and problem-solving',
      available: isPaidAffiliate,
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: 'gemini',
      name: 'Google Gemini Pro',
      description: 'Google\'s powerful multimodal AI for text, code, and creative tasks',
      available: isPaidAffiliate,
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'perplexity',
      name: 'Perplexity AI (Limited)',
      description: 'AI search and research assistant with real-time web access',
      available: true, // Available to all users but limited
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  const handleAIQuery = async () => {
    if (!prompt.trim()) return;
    if (remainingUses <= 0) {
      alert('Monthly usage limit reached. Upgrade to paid plan for unlimited access.');
      return;
    }

    setIsLoading(true);
    try {
      let aiPrompt = prompt;
      
      // Add context based on selected AI tool
      switch(activeAI) {
        case 'chatgpt':
          aiPrompt = `As ChatGPT-4, provide a comprehensive and detailed response to: ${prompt}`;
          break;
        case 'gemini':
          aiPrompt = `As Google Gemini Pro, provide a thorough analysis and response to: ${prompt}`;
          break;
        case 'perplexity':
          aiPrompt = `As Perplexity AI, provide a research-backed response with current information about: ${prompt}`;
          break;
      }

      const result = await InvokeLLM({
        prompt: aiPrompt,
        add_context_from_internet: activeAI === 'perplexity' // Only Perplexity gets web access
      });

      setResponse(result);
      setUsageCount(prev => prev + 1);
    } catch (error) {
      console.error('AI query failed:', error);
      setResponse('Sorry, there was an error processing your request. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTool = aiTools.find(tool => tool.id === activeAI);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            AI Assistant Tools
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Access powerful AI tools for content creation, research, and automation.
            </p>
            <Badge variant={isPaidAffiliate ? "default" : "secondary"}>
              {remainingUses} / {monthlyLimit} uses remaining
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Tool Selection */}
          <div className="grid md:grid-cols-3 gap-4">
            {aiTools.map(tool => (
              <Card 
                key={tool.id}
                className={`cursor-pointer transition-all ${
                  activeAI === tool.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                } ${!tool.available ? 'opacity-50' : 'hover:shadow-md'}`}
                onClick={() => tool.available && setActiveAI(tool.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    {tool.icon}
                    <h3 className="font-semibold">{tool.name}</h3>
                    {!tool.available && <Badge variant="outline">Paid Only</Badge>}
                  </div>
                  <p className="text-sm text-slate-600">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isPaidAffiliate && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You're on the free tier with limited access. Upgrade to paid affiliate ($10/month) for unlimited AI tool access including ChatGPT-4 and Gemini Pro.
              </AlertDescription>
            </Alert>
          )}

          {/* Query Interface */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Ask {selectedTool?.name}
              </label>
              <Textarea
                placeholder="Enter your question or request..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-24"
              />
            </div>

            <Button 
              onClick={handleAIQuery}
              disabled={isLoading || remainingUses <= 0 || !selectedTool?.available}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedTool?.icon && React.cloneElement(selectedTool.icon, { className: "w-4 h-4" })}
                  <span className="ml-2">Ask {selectedTool?.name}</span>
                </>
              )}
            </Button>
          </div>

          {/* Response Display */}
          {response && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Response</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                    {response}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
