
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  FileText, 
  Image as ImageIcon, 
  DollarSign, 
  BarChart3, 
  Mail,
  Layout,
  Sparkles,
  FileEdit,
  Settings,
  Users,
  Zap,
  TestTube,
  Download,
  CreditCard,
  BookText,
  ShieldCheck
} from "lucide-react";

import BlogManagementRow from "../components/admin/BlogManagementRow";
import BlogQuickActions from "../components/admin/BlogQuickActions";
import MonthlyReportsTab from "../components/admin/MonthlyReportsTab";
import SEOEnhancementTool from "../components/admin/SEOEnhancementTool";
import BulkBlogGenerator from "../components/admin/BulkBlogGenerator";
import BlogRewriteTool from "../components/admin/BlogRewriteTool";
import FixListingDescriptions from "../components/admin/FixListingDescriptions";
import BlogContentReformatter from "../components/admin/BlogContentReformatter";
import BulkImageRegeneration from "../components/admin/BulkImageRegeneration";
import LogoManager from "../components/admin/LogoManager";
import CompleteBlogGenerator from "../components/admin/CompleteBlogGenerator";
import SocialMediaThreadGenerator from "../components/admin/SocialMediaThreadGenerator";
import SEOIntelligenceBlogGenerator from "../components/admin/SEOIntelligenceBlogGenerator";
import AutoresponderManagement from "../components/admin/AutoresponderManagement";
import EmailListManager from "../components/admin/EmailListManager";
import EmailTemplateLibrary from "../components/admin/EmailTemplateLibrary";
import ABTestingManager from "../components/admin/ABTestingManager";
import AdvancedAnalytics from "../components/admin/AdvancedAnalytics";
import ListingExporter from "../components/admin/ListingExporter";
import HealthDashboardWidget from "../components/admin/HealthDashboardWidget";

export default function AdminPage() {
  const [listings, setListings] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("submissions");
  const [activeSubTab, setActiveSubTab] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [listingsData, blogData] = await Promise.all([
        base44.entities.DirectoryListing.filter({ status: 'pending_review' }, "-created_date", 100),
        base44.entities.BlogPost.list("-created_date", 100)
      ]);
      setListings(listingsData);
      setBlogPosts(blogData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const approveSubmission = async (id) => {
    try {
      await base44.entities.DirectoryListing.update(id, { status: 'approved' });
      await loadData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const rejectSubmission = async (id) => {
    try {
      await base44.entities.DirectoryListing.update(id, { status: 'rejected' });
      await loadData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteBlogPost = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await base44.entities.BlogPost.delete(id);
      await loadData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Panel</h1>
          <p className="text-slate-600">Manage listings, submissions, and content.</p>
        </div>

        {/* NEW: Health Dashboard Widget (shows before tabs) */}
        <div className="mb-6">
          <HealthDashboardWidget />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setActiveSubTab(""); }} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent h-auto p-0">
              <TabsTrigger value="submissions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Submissions</span>
              </TabsTrigger>
              <TabsTrigger value="banner-ads" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Banner Ads</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <BookText className="w-4 h-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <FileEdit className="w-4 h-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Images</span>
              </TabsTrigger>
              <TabsTrigger value="logos" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <Layout className="w-4 h-4" />
                <span className="hidden sm:inline">Logos</span>
              </TabsTrigger>
              <TabsTrigger value="affiliates" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center gap-2 py-3 px-4">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Affiliates</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Sub Navigation */}
          {activeTab && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {activeTab === "submissions" && (
                  <>
                    <Button 
                      variant={activeSubTab === "autoresponders" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("autoresponders")}
                      className="justify-start"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Autoresponders
                    </Button>
                    <Button 
                      variant={activeSubTab === "seo" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("seo")}
                      className="justify-start"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      SEO Fix
                    </Button>
                  </>
                )}

                {activeTab === "banner-ads" && (
                  <>
                    <Button 
                      variant={activeSubTab === "email-list" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("email-list")}
                      className="justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Email List
                    </Button>
                    <Button 
                      variant={activeSubTab === "manage" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("manage")}
                      className="justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </>
                )}

                {activeTab === "content" && (
                  <>
                    <Button 
                      variant={activeSubTab === "templates" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("templates")}
                      className="justify-start"
                    >
                      <Layout className="w-4 h-4 mr-2" />
                      Templates
                    </Button>
                    <Button 
                      variant={activeSubTab === "website" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("website")}
                      className="justify-start"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Website
                    </Button>
                    <Button 
                      variant={activeSubTab === "fix-desc" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("fix-desc")}
                      className="justify-start"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Fix Desc
                    </Button>
                  </>
                )}

                {activeTab === "analytics" && (
                  <>
                    <Button 
                      variant={activeSubTab === "ab-testing" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("ab-testing")}
                      className="justify-start"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      A/B Testing
                    </Button>
                    <Button 
                      variant={activeSubTab === "advanced" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("advanced")}
                      className="justify-start"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Advanced
                    </Button>
                  </>
                )}

                {activeTab === "blog" && (
                  <>
                    <Button 
                      variant={activeSubTab === "rewrite" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("rewrite")}
                      className="justify-start"
                    >
                      <FileEdit className="w-4 h-4 mr-2" />
                      Rewrite
                    </Button>
                    <Button 
                      variant={activeSubTab === "reformat" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("reformat")}
                      className="justify-start"
                    >
                      <Layout className="w-4 h-4 mr-2" />
                      Reformat
                    </Button>
                  </>
                )}

                {activeTab === "images" && (
                  <>
                    <Button 
                      variant={activeSubTab === "export" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("export")}
                      className="justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      variant={activeSubTab === "testing" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("testing")}
                      className="justify-start"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Testing
                    </Button>
                  </>
                )}

                {activeTab === "affiliates" && (
                  <>
                    <Button 
                      variant={activeSubTab === "rewrite-actions" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("rewrite-actions")}
                      className="justify-start"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Actions
                    </Button>
                    <Button 
                      variant={activeSubTab === "paypal" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveSubTab("paypal")}
                      className="justify-start"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      PayPal
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="submissions" className="space-y-6 mt-0">
              {activeSubTab === "autoresponders" && <AutoresponderManagement />}
              {activeSubTab === "seo" && <SEOEnhancementTool />}
              {!activeSubTab && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Pending Submissions ({listings.length})</span>
                      {listings.length > 0 && (
                        <Badge variant="destructive">{listings.length} pending</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {listings.length === 0 ? (
                      <div className="text-center py-12">
                        <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <p className="text-slate-600">No pending submissions. Great job!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {listings.map((listing) => (
                          <Card key={listing.id} className="border-2">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-lg mb-2">{listing.name}</h3>
                                  <p className="text-sm text-slate-600 mb-3">{listing.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">{listing.category}</Badge>
                                    <Badge variant="secondary">{listing.chain}</Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Button 
                                    size="sm" 
                                    onClick={() => approveSubmission(listing.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => rejectSubmission(listing.id)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="banner-ads" className="space-y-6 mt-0">
              {activeSubTab === "email-list" && <EmailListManager />}
              {activeSubTab === "manage" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Ad Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">Manage banner advertisements across the site.</p>
                  </CardContent>
                </Card>
              )}
              {!activeSubTab && (
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Ads Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertTitle className="text-yellow-800 font-semibold">📊 Pending Banner Ad Submissions (0)</AlertTitle>
                        <AlertDescription className="text-yellow-800">
                          <p className="mt-2">Review banner images, approve or reject advertising submissions</p>
                        </AlertDescription>
                      </Alert>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Active Banner Advertisements</CardTitle>
                          <p className="text-sm text-slate-600">Currently running banner ads across the site</p>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8 text-slate-500">
                            No active banner advertisements yet.
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-6 mt-0">
              {activeSubTab === "templates" && <EmailTemplateLibrary />}
              {activeSubTab === "website" && <CompleteBlogGenerator />}
              {activeSubTab === "fix-desc" && <FixListingDescriptions />}
              {!activeSubTab && (
                <div className="space-y-6">
                  <CompleteBlogGenerator />
                  <BulkBlogGenerator />
                  <SEOIntelligenceBlogGenerator />
                  <SocialMediaThreadGenerator />
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-0">
              {activeSubTab === "ab-testing" && <ABTestingManager />}
              {activeSubTab === "advanced" && <AdvancedAnalytics />}
              {!activeSubTab && <MonthlyReportsTab />}
            </TabsContent>

            <TabsContent value="blog" className="space-y-6 mt-0">
              {activeSubTab === "rewrite" && <BlogRewriteTool />}
              {activeSubTab === "reformat" && <BlogContentReformatter />}
              {!activeSubTab && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Blog Posts ({blogPosts.length})</span>
                      <BlogQuickActions onComplete={loadData} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blogPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">No blog posts yet. Create your first one!</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {blogPosts.map((post) => (
                          <BlogManagementRow 
                            key={post.id} 
                            post={post} 
                            onDelete={deleteBlogPost}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="images" className="space-y-6 mt-0">
              {activeSubTab === "export" && <ListingExporter />}
              {activeSubTab === "testing" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Image Testing Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">Test and validate images across the platform.</p>
                  </CardContent>
                </Card>
              )}
              {!activeSubTab && <BulkImageRegeneration />}
            </TabsContent>

            <TabsContent value="logos" className="space-y-6 mt-0">
              <LogoManager />
            </TabsContent>

            <TabsContent value="affiliates" className="space-y-6 mt-0">
              {activeSubTab === "rewrite-actions" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Affiliate Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">Manage affiliate program actions and rewards.</p>
                  </CardContent>
                </Card>
              )}
              {activeSubTab === "paypal" && (
                <Card>
                  <CardHeader>
                    <CardTitle>PayPal Tier Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">Configure PayPal payment tiers for affiliates.</p>
                  </CardContent>
                </Card>
              )}
              {!activeSubTab && (
                <Card>
                  <CardHeader>
                    <CardTitle>Affiliate Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">View and manage affiliate accounts, commissions, and payouts.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
