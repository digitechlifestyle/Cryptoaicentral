
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { APIKey } from "@/api/entities";
import { Key, Eye, EyeOff, Edit, Trash2, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function APIKeysPanel({ affiliate }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState({ service: '', key: '', active: true });
  const [visibleKeys, setVisibleKeys] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isPaidAffiliate = affiliate.status === 'active';

  const supportedServices = [
    { id: 'openai', name: 'OpenAI (ChatGPT)', description: 'GPT-4, GPT-3.5, DALL-E access', paid: true },
    { id: 'google', name: 'Google Gemini', description: 'Gemini Pro and Vision models', paid: true },
    { id: 'anthropic', name: 'Anthropic Claude', description: 'Claude 3 models', paid: true },
    { id: 'perplexity', name: 'Perplexity AI', description: 'Research and search AI', free: true },
    { id: 'replicate', name: 'Replicate', description: 'Open source AI models', paid: true },
    { id: 'huggingface', name: 'Hugging Face', description: 'Open source models and inference', free: true }
  ];

  const loadApiKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await APIKey.filter({ affiliate_id: affiliate.id }, "-created_date", 50);
      setApiKeys(data);
    } catch (error) {
      console.error("Error loading API keys:", error);
    }
    setIsLoading(false);
  }, [affiliate.id]);

  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  const addApiKey = async () => {
    if (!newKey.service || !newKey.key.trim()) {
      alert('Please select a service and enter an API key.');
      return;
    }

    const selectedService = supportedServices.find(s => s.id === newKey.service);
    if (selectedService?.paid && !isPaidAffiliate) {
      alert('Paid AI services require a paid affiliate subscription.');
      return;
    }

    try {
      await APIKey.create({
        affiliate_id: affiliate.id,
        service: newKey.service,
        api_key: newKey.key,
        active: newKey.active,
        service_name: supportedServices.find(s => s.id === newKey.service)?.name
      });

      setNewKey({ service: '', key: '', active: true });
      setIsAdding(false);
      await loadApiKeys();
    } catch (error) {
      console.error('Failed to add API key:', error);
      alert('Failed to add API key. Please try again.');
    }
  };

  const toggleApiKey = async (keyId, active) => {
    try {
      await APIKey.update(keyId, { active });
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, active } : key
      ));
    } catch (error) {
      console.error('Failed to toggle API key:', error);
    }
  };

  const deleteApiKey = async (keyId) => {
    if (!window.confirm('Delete this API key? This action cannot be undone.')) return;

    try {
      await APIKey.delete(keyId);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskKey = (key) => {
    if (!key) return '';
    return key.substring(0, 8) + '•'.repeat(Math.max(0, key.length - 12)) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-6 h-6 text-indigo-600" />
            API Key Management
          </CardTitle>
          <p className="text-slate-600">
            Manage your AI service API keys for enhanced functionality.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isPaidAffiliate && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Free users can only use free AI services. Upgrade to paid affiliate for premium AI APIs like ChatGPT-4, Gemini Pro, etc.
              </AlertDescription>
            </Alert>
          )}

          {/* Add New API Key */}
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add API Key
            </Button>
          ) : (
            <Card className="bg-slate-50">
              <CardContent className="pt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    AI Service
                  </label>
                  <select 
                    value={newKey.service}
                    onChange={(e) => setNewKey({...newKey, service: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select AI Service</option>
                    {supportedServices.map(service => (
                      <option 
                        key={service.id} 
                        value={service.id}
                        disabled={service.paid && !isPaidAffiliate}
                      >
                        {service.name} {service.paid && !isPaidAffiliate ? '(Paid Only)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    API Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your API key..."
                    value={newKey.key}
                    onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addApiKey}>
                    Add Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Information */}
          <div>
            <h3 className="font-semibold mb-3">Supported AI Services</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {supportedServices.map(service => (
                <Card key={service.id} className={!isPaidAffiliate && service.paid ? 'opacity-50' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{service.name}</h4>
                      <div className="flex gap-1">
                        {service.free && <Badge variant="outline">Free</Badge>}
                        {service.paid && <Badge>Paid</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{service.description}</p>
                    {!isPaidAffiliate && service.paid && (
                      <p className="text-xs text-orange-600 mt-2">
                        Requires paid affiliate subscription
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Existing API Keys */}
          <div>
            <h3 className="font-semibold mb-4">Your API Keys</h3>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No API keys configured. Add one above to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map(key => (
                  <Card key={key.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{key.service_name}</h4>
                            <Badge variant={key.active ? "default" : "secondary"}>
                              {key.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                              {visibleKeys[key.id] ? key.api_key : maskKey(key.api_key)}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {visibleKeys[key.id] ? 
                                <EyeOff className="w-4 h-4" /> : 
                                <Eye className="w-4 h-4" />
                              }
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={key.active}
                            onCheckedChange={(active) => toggleApiKey(key.id, active)}
                          />
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteApiKey(key.id)}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
