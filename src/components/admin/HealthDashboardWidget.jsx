import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function HealthDashboardWidget() {
  const [quickStats, setQuickStats] = useState({
    totalIssues: 0,
    criticalIssues: 0,
    healthScore: 100,
    lastChecked: null,
    shouldRunCheck: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runQuickCheck();
  }, []);

  const runQuickCheck = async () => {
    setIsLoading(true);
    try {
      const [posts, listings] = await Promise.all([
        base44.entities.BlogPost.list("-created_date", 100),
        base44.entities.DirectoryListing.list("-created_date", 200)
      ]);

      let criticalCount = 0;
      let warningCount = 0;

      // Check for missing images
      const postsWithoutImages = posts.filter(p => !p.featured_image);
      if (postsWithoutImages.length > 0) {
        criticalCount++;
      }

      // Check for duplicate images
      const imageMap = new Map();
      posts.forEach(post => {
        if (post.featured_image) {
          if (!imageMap.has(post.featured_image)) {
            imageMap.set(post.featured_image, []);
          }
          imageMap.get(post.featured_image).push(post);
        }
      });
      const duplicates = Array.from(imageMap.entries()).filter(([, posts]) => posts.length > 1);
      if (duplicates.length > 0) warningCount++;

      // Check descriptions
      const shortDescriptions = listings.filter(l => !l.description || l.description.length < 50);
      if (shortDescriptions.length > 0) warningCount++;

      // Check URLs
      const invalidUrls = listings.filter(l => {
        if (!l.website) return true;
        try {
          new URL(l.website);
          return false;
        } catch {
          return true;
        }
      });
      if (invalidUrls.length > 0) criticalCount++;

      // Check formatting
      const poorFormatting = posts.filter(p => {
        if (!p.content) return false;
        const hasProperHeaders = /^##\s+/m.test(p.content);
        return !hasProperHeaders;
      });
      if (poorFormatting.length > 0) warningCount++;

      const totalIssues = criticalCount + warningCount;
      const healthScore = Math.max(0, 100 - (criticalCount * 10) - (warningCount * 2));

      // Check if last run was more than 24 hours ago
      const lastChecked = localStorage.getItem('lastHealthCheck');
      const lastCheckDate = lastChecked ? new Date(lastChecked) : null;
      const shouldRunCheck = !lastCheckDate || 
        (Date.now() - lastCheckDate.getTime() > 24 * 60 * 60 * 1000);

      localStorage.setItem('lastHealthCheck', new Date().toISOString());

      setQuickStats({
        totalIssues,
        criticalIssues: criticalCount,
        healthScore,
        lastChecked: new Date().toISOString(),
        shouldRunCheck
      });
    } catch (error) {
      console.error('Quick health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthIcon = (score) => {
    if (score >= 90) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  const getLastCheckedText = () => {
    if (!quickStats.lastChecked) return 'Never';
    
    const now = Date.now();
    const checked = new Date(quickStats.lastChecked).getTime();
    const diff = now - checked;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            🤖 <span>Site Health</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={runQuickCheck}
            disabled={isLoading}
            className="gap-1"
          >
            {isLoading ? (
              <>
                <Play className="w-3 h-3 animate-pulse" />
                Checking...
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                Run Check
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Health Score */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getHealthIcon(quickStats.healthScore)}
              <div>
                <p className="text-sm font-semibold text-slate-700">Overall Health</p>
                <p className="text-xs text-slate-500">
                  Last checked: {getLastCheckedText()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${getHealthColor(quickStats.healthScore)}`}>
                {quickStats.healthScore}%
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                {quickStats.healthScore >= 90 ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span>Excellent</span>
                  </>
                ) : quickStats.healthScore >= 70 ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    <span>Needs Attention</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-600" />
                    <span>Critical</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Issue Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-red-900">Critical</p>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {quickStats.criticalIssues}
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-yellow-900">Total Issues</p>
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {quickStats.totalIssues}
              </p>
            </div>
          </div>

          {/* Daily Check Reminder */}
          {quickStats.shouldRunCheck && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-900">
                    Daily Health Check Recommended
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    It's been 24+ hours since your last check. Run a full scan to ensure optimal site performance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link to={createPageUrl("SiteHealthCheck")} className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Health Report
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}