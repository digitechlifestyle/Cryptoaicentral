import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, Calendar, Download, TrendingUp, DollarSign, Eye, MousePointer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MonthlyReportsTab() {
  const [reports, setReports] = useState([]);
  const [currentMonthStats, setCurrentMonthStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadReports();
    generateCurrentMonthStats();
  }, []);

  const loadReports = async () => {
    try {
      const data = await base44.entities.MonthlyReport.list('-created_date', 12);
      // Sort by year and month in memory
      const sorted = data.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
      setReports(sorted);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports([]);
    }
  };

  const generateCurrentMonthStats = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // Get start and end of current month
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
      const endOfMonth = new Date(currentYear, currentMonth, 0);
      
      const [listings, analytics, affiliates] = await Promise.all([
        base44.entities.DirectoryListing.filter({ status: 'approved' }),
        base44.entities.Analytics.filter({
          created_date: { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() }
        }),
        base44.entities.Affiliate.list()
      ]);

      // Calculate stats
      const featuredCount = listings.filter(l => l.featured).length;
      const sponsoredCount = listings.filter(l => l.sponsored).length;
      const bannerCount = listings.filter(l => l.banner_type && l.banner_type !== 'none').length;
      
      const totalViews = analytics.filter(a => a.event_type === 'listing_view').length;
      const totalClicks = analytics.filter(a => a.event_type === 'listing_click').length;
      
      const thisMonthAffiliates = affiliates.filter(a => 
        new Date(a.created_date) >= startOfMonth && new Date(a.created_date) <= endOfMonth
      ).length;
      
      // Revenue calculations
      const revenue = {
        featured: featuredCount * 99,
        sponsored: sponsoredCount * 199,
        banners: bannerCount * 299,
        affiliates: affiliates.reduce((sum, a) => sum + (a.earnings || 0), 0),
        total: 0
      };
      revenue.total = revenue.featured + revenue.sponsored + revenue.banners;

      setCurrentMonthStats({
        year: currentYear,
        month: currentMonth,
        total_listings: listings.length,
        featured_listings: featuredCount,
        sponsored_listings: sponsoredCount,
        banner_ads: bannerCount,
        total_views: totalViews,
        total_clicks: totalClicks,
        affiliate_signups: thisMonthAffiliates,
        revenue
      });
    } catch (error) {
      console.error('Failed to generate current month stats:', error);
    }
    setIsLoading(false);
  };

  const generateMonthlyReport = async () => {
    if (!currentMonthStats) {
      alert('Please wait for stats to load');
      return;
    }

    setIsGenerating(true);
    try {
      await base44.entities.MonthlyReport.create({
        year: currentMonthStats.year,
        month: currentMonthStats.month,
        total_listings: currentMonthStats.total_listings,
        featured_listings: currentMonthStats.featured_listings,
        sponsored_listings: currentMonthStats.sponsored_listings,
        banner_ads: currentMonthStats.banner_ads,
        total_views: currentMonthStats.total_views,
        total_clicks: currentMonthStats.total_clicks,
        affiliate_signups: currentMonthStats.affiliate_signups,
        revenue: currentMonthStats.revenue
      });
      
      alert('✅ Monthly report generated successfully!');
      await loadReports();
    } catch (error) {
      console.error('Failed to generate monthly report:', error);
      alert('Failed to generate report: ' + error.message);
    }
    setIsGenerating(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>
          <p className="text-slate-600">Track performance and generate monthly reports</p>
        </div>
        <Button 
          onClick={generateMonthlyReport}
          disabled={isGenerating || !currentMonthStats}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>

      {/* Current Month Overview */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : currentMonthStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthStats.total_listings}</div>
              <p className="text-xs text-muted-foreground">
                {currentMonthStats.featured_listings} featured, {currentMonthStats.sponsored_listings} sponsored
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthStats.total_views}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthStats.total_clicks}</div>
              <p className="text-xs text-muted-foreground">
                {currentMonthStats.total_views > 0 ? 
                  ((currentMonthStats.total_clicks / currentMonthStats.total_views) * 100).toFixed(1) + '% CTR' : 
                  '0% CTR'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentMonthStats.revenue.total)}</div>
              <p className="text-xs text-muted-foreground">
                {currentMonthStats.affiliate_signups} new affiliates
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historical Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reports History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={`${report.year}-${report.month}`}>
                    <TableCell>{getMonthName(report.month)} {report.year}</TableCell>
                    <TableCell>{report.total_listings}</TableCell>
                    <TableCell>{report.total_views}</TableCell>
                    <TableCell>{report.total_clicks}</TableCell>
                    <TableCell>{formatCurrency(report.revenue?.total || 0)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No reports generated yet. Click "Generate Report" to create your first monthly report.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}