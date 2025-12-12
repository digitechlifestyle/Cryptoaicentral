import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Mail, Eye, MousePointer, Calendar } from "lucide-react";

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState({
    newsletters: [],
    subscribers: [],
    campaigns: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [subs, camps] = await Promise.all([
        base44.entities.NewsletterSubscriber.list("-created_date", 10000),
        base44.entities.NewsletterCampaign.list("-created_date", 100)
      ]);

      setAnalytics({
        subscribers: subs,
        campaigns: camps
      });
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const stats = {
    totalSubscribers: analytics.subscribers.length,
    totalCampaigns: analytics.campaigns.length,
    totalSent: analytics.campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0),
    avgOpenRate: analytics.campaigns.length > 0 
      ? (analytics.campaigns.reduce((acc, c) => acc + (c.opened_count || 0), 0) / analytics.campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0) * 100).toFixed(1)
      : 0,
    avgClickRate: analytics.campaigns.length > 0
      ? (analytics.campaigns.reduce((acc, c) => acc + (c.clicked_count || 0), 0) / analytics.campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0) * 100).toFixed(1)
      : 0,
    growthRate: 0 // Calculate based on time periods
  };

  // Calculate growth
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthSubs = analytics.subscribers.filter(s => new Date(s.created_date) >= lastMonth).length;
  const prevMonthSubs = analytics.subscribers.filter(s => {
    const created = new Date(s.created_date);
    return created < lastMonth && created >= new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }).length;
  
  stats.growthRate = prevMonthSubs > 0 ? (((thisMonthSubs - prevMonthSubs) / prevMonthSubs) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Advanced Analytics</h3>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Subscribers</p>
                <p className="text-3xl font-bold">{stats.totalSubscribers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+{stats.growthRate}%</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Sent</p>
                <p className="text-3xl font-bold">{stats.totalSent}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {stats.totalCampaigns} campaigns
                </p>
              </div>
              <Mail className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Open Rate</p>
                <p className="text-3xl font-bold">{stats.avgOpenRate}%</p>
                <p className="text-xs text-slate-500 mt-1">
                  Industry avg: 21%
                </p>
              </div>
              <Eye className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Click Rate</p>
                <p className="text-3xl font-bold">{stats.avgClickRate}%</p>
                <p className="text-xs text-slate-500 mt-1">
                  Industry avg: 2.3%
                </p>
              </div>
              <MousePointer className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Top Performing Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.campaigns
              .filter(c => c.status === 'sent')
              .sort((a, b) => {
                const aRate = a.sent_count > 0 ? (a.opened_count / a.sent_count) : 0;
                const bRate = b.sent_count > 0 ? (b.opened_count / b.sent_count) : 0;
                return bRate - aRate;
              })
              .slice(0, 5)
              .map((campaign, index) => {
                const openRate = campaign.sent_count > 0 
                  ? ((campaign.opened_count || 0) / campaign.sent_count * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{campaign.campaign_name}</p>
                        <p className="text-xs text-slate-600">{campaign.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{openRate}%</p>
                      <p className="text-xs text-slate-500">{campaign.sent_count} sent</p>
                    </div>
                  </div>
                );
              })}
            {analytics.campaigns.filter(c => c.status === 'sent').length === 0 && (
              <p className="text-center text-slate-500 py-8">No campaigns sent yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscriber Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Subscriber Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4, 5].map((monthsAgo) => {
              const date = new Date();
              date.setMonth(date.getMonth() - monthsAgo);
              const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
              const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
              
              const count = analytics.subscribers.filter(s => {
                const created = new Date(s.created_date);
                return created >= monthStart && created <= monthEnd;
              }).length;

              return (
                <div key={monthsAgo} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">{monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  <Badge variant="outline">+{count} subscribers</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}