import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Upload, Download, Trash2, Mail, Search, Filter, Loader2 } from "lucide-react";

export default function EmailListManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [searchTerm, subscribers]);

  const loadSubscribers = async () => {
    try {
      const data = await base44.entities.NewsletterSubscriber.list("-created_date", 10000);
      setSubscribers(data);
      setFilteredSubscribers(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const filterSubscribers = () => {
    if (!searchTerm) {
      setFilteredSubscribers(subscribers);
      return;
    }

    const filtered = subscribers.filter(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  };

  const handleBulkAdd = async () => {
    if (!bulkEmails.trim()) {
      alert("Please enter emails");
      return;
    }

    const lines = bulkEmails.split('\n').map(line => line.trim()).filter(line => line);
    let added = 0;
    let failed = 0;

    for (const line of lines) {
      const parts = line.split(',');
      const email = parts[0]?.trim();
      const name = parts[1]?.trim() || email.split('@')[0];

      if (!email || !email.includes('@')) {
        failed++;
        continue;
      }

      try {
        await base44.entities.NewsletterSubscriber.create({ email, name });
        added++;
      } catch (error) {
        failed++;
      }
    }

    alert(`✅ Added ${added} subscribers. ${failed > 0 ? `Failed: ${failed}` : ''}`);
    setBulkEmails("");
    loadSubscribers();
  };

  const exportToCSV = () => {
    const csv = [
      "Name,Email,Joined Date",
      ...subscribers.map(sub => `"${sub.name}","${sub.email}","${new Date(sub.created_date).toLocaleDateString()}"`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const deleteSubscriber = async (id) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await base44.entities.NewsletterSubscriber.delete(id);
      loadSubscribers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stats = {
    total: subscribers.length,
    thisWeek: subscribers.filter(s => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(s.created_date) > weekAgo;
    }).length,
    thisMonth: subscribers.filter(s => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(s.created_date) > monthAgo;
    }).length
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
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Subscribers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">This Week</p>
                <p className="text-2xl font-bold text-green-600">+{stats.thisWeek}</p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">+{stats.thisMonth}</p>
              </div>
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Add */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            Bulk Add Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Format:</strong> One per line. Use <code>email@example.com, Full Name</code> or just <code>email@example.com</code>
            </AlertDescription>
          </Alert>
          <textarea
            value={bulkEmails}
            onChange={(e) => setBulkEmails(e.target.value)}
            placeholder="john@example.com, John Doe&#10;jane@example.com, Jane Smith&#10;bob@example.com"
            className="w-full h-32 p-3 border rounded-lg font-mono text-sm"
          />
          <Button onClick={handleBulkAdd} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Add Subscribers
          </Button>
        </CardContent>
      </Card>

      {/* List Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Subscriber List
            </span>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Subscriber List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredSubscribers.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-sm text-slate-600">{sub.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Joined {new Date(sub.created_date).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => deleteSubscriber(sub.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? "No subscribers found" : "No subscribers yet"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}