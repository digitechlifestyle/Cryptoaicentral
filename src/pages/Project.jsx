
import React, { useState, useEffect } from "react";
import { DirectoryListing } from "@/api/entities";
import { Review } from "@/api/entities";
import { User } from "@/api/entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Shield, Star, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ProjectHeader from "../components/project/ProjectHeader";
import ProjectStats from "../components/project/ProjectStats";
import ReviewSection from "../components/project/ReviewSection";
import RelatedProjects from "../components/project/RelatedProjects";
import SeoMeta from "../components/shared/SeoMeta";
import RotatingBanner from "../components/shared/RotatingBanner";
import GoogleAd from "../components/shared/GoogleAd";
import SocialShareButtons from "../components/shared/SocialShareButtons";
import ShareTracker from "../components/points/ShareTracker";

import VotingPanel from "../components/voting/VotingPanel";
import VideoReviewSection from "../components/video/VideoReviewSection";

export default function ProjectPage() {
  const [project, setProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProject();
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const loadProject = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('id');
      
      if (!projectId) {
        console.log("No project ID in URL");
        setIsLoading(false);
        return;
      }

      console.log("Looking for project with ID:", projectId);

      // First try to find the project by ID regardless of status
      let projectData = await DirectoryListing.filter({ id: projectId }, "-created_date", 1);
      
      // If not found by ID, try to find by name (in case the ID format is different)
      if (projectData.length === 0) {
        console.log("No project found by ID, trying all approved projects");
        const allProjects = await DirectoryListing.filter({ status: 'approved' }, "-created_date", 100);
        projectData = allProjects.filter(p => p.id === projectId);
      }

      console.log("Found projects:", projectData.length);

      if (projectData.length === 0) {
        console.log("No project found with ID:", projectId);
        setIsLoading(false);
        return;
      }

      const currentProject = projectData[0];
      console.log("Current project:", currentProject.name, "Status:", currentProject.status);

      // Only show approved projects to public (admins can see any)
      if (currentProject.status !== 'approved') {
        const currentUser = await User.me().catch(() => null);
        if (!currentUser || currentUser.role !== 'admin') {
          console.log("Project not approved and user is not admin");
          setIsLoading(false);
          return;
        }
      }

      const [reviewData, relatedData] = await Promise.all([
        Review.filter({ listing_id: projectId }, "-created_date", 50),
        DirectoryListing.filter({ status: 'approved' }, "-created_date", 20)
      ]);

      setProject(currentProject);
      setReviews(reviewData);
      
      // Filter related projects by category
      const related = relatedData
        .filter(p => p.id !== currentProject.id && p.category === currentProject.category)
        .slice(0, 3);
      setRelatedProjects(related);

    } catch (error) {
      console.error("Error loading project:", error);
    }
    setIsLoading(false);
  };

  const handleReviewAdded = () => {
    loadProject(); // Refresh reviews
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <SeoMeta 
          title="Loading Project | Crypto AI Central"
          description="Loading project details..."
        />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <SeoMeta 
          title="Project Not Found | Crypto AI Central"
          description="The project you are looking for does not exist or could not be found."
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h1>
          <p className="text-slate-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link to={createPageUrl("Browse")}>
            <Button>Browse All Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = `${project.name} | Crypto AI Central`;
  const pageDescription = project.description || `Discover more about ${project.name}, a project in the ${project.category} category. Read reviews and find related projects.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <ShareTracker />
      
      <SeoMeta 
        title={pageTitle}
        description={pageDescription}
        imageUrl={project.logo_url}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={createPageUrl("Browse")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ProjectHeader project={project} />
            <ProjectStats project={project} />
            
            {/* Share Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Share this project & earn points!</CardTitle>
              </CardHeader>
              <CardContent>
                <SocialShareButtons
                  title={project.name}
                  description={project.description}
                  contentType="project"
                  contentId={project.id}
                  variant="default"
                />
              </CardContent>
            </Card>

            {/* Video Reviews Section */}
            <VideoReviewSection listingId={project.id} />
            
            <ReviewSection 
              project={project}
              reviews={reviews}
              user={user}
              onReviewAdded={handleReviewAdded}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rectangle Banner */}
            <div className="flex justify-center">
              <RotatingBanner bannerType="rectangle" />
            </div>
            
            {/* Google AdSense Rectangle */}
            <div className="flex justify-center">
              <GoogleAd 
                adSlot="2345678901" 
                style={{ display: 'block', width: '300px', height: '250px' }}
                adFormat="rectangle"
              />
            </div>
            
            {/* Voting Panel */}
            <VotingPanel listingId={project.id} />
            
            {/* Compare Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = createPageUrl("Compare") + `?ids=${project.id}`}
            >
              Compare with Others
            </Button>
            
            <RelatedProjects projects={relatedProjects} />
            
            {/* Another Rectangle Banner */}
            <div className="flex justify-center">
              <RotatingBanner bannerType="rectangle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
