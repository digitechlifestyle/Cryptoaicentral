import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ThumbsUp, Eye, CheckCircle, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function VideoReviewSection({ listingId }) {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadVideos();
  }, [listingId]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const videoData = await base44.entities.VideoReview.filter({
        listing_id: listingId,
        status: "approved"
      }, "-created_date", 20);
      setVideos(videoData);
    } catch (error) {
      console.error("Failed to load videos:", error);
    }
    setIsLoading(false);
  };

  const getVideoEmbedUrl = (url) => {
    // Convert YouTube URL to embed URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert Vimeo URL to embed URL
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleAddVideo = async (formData) => {
    if (!user) {
      toast({ title: "Please login to submit a video review", variant: "destructive" });
      return;
    }

    try {
      await base44.entities.VideoReview.create({
        listing_id: listingId,
        ...formData,
        reviewer_name: user.full_name || user.email,
        status: "pending"
      });
      
      toast({ title: "Video submitted for review" });
      setShowAddDialog(false);
      loadVideos();
    } catch (error) {
      console.error("Failed to submit video:", error);
      toast({ title: "Failed to submit video", variant: "destructive" });
    }
  };

  const incrementView = async (videoId) => {
    try {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        await base44.entities.VideoReview.update(videoId, {
          views: video.views + 1
        });
      }
    } catch (error) {
      console.error("Failed to increment view:", error);
    }
  };

  if (videos.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <Play className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">No video reviews yet</p>
          <AddVideoDialog onSubmit={handleAddVideo}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Submit First Video Review
            </Button>
          </AddVideoDialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Video Reviews & Demos</h3>
          {user && (
            <AddVideoDialog onSubmit={handleAddVideo}>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </AddVideoDialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedVideo(video);
                incrementView(video.id);
              }}
            >
              <div className="relative overflow-hidden rounded-lg mb-2">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full aspect-video bg-slate-200 flex items-center justify-center">
                    <Play className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-blue-600 ml-1" />
                  </div>
                </div>
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.views}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {video.helpful_votes}
                </span>
                {video.verified && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Dialog */}
        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
              </DialogHeader>
              <div className="aspect-video">
                <iframe
                  src={getVideoEmbedUrl(selectedVideo.video_url)}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {selectedVideo.description && (
                <p className="text-slate-600 mt-4">{selectedVideo.description}</p>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}

function AddVideoDialog({ children, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    thumbnail_url: "",
    duration: "",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", video_url: "", thumbnail_url: "", duration: "", description: "" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Video Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Video title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            placeholder="YouTube or Vimeo URL"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            required
          />
          <Input
            placeholder="Thumbnail URL (optional)"
            value={formData.thumbnail_url}
            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
          />
          <Input
            placeholder="Duration (e.g., 5:30)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
          <Textarea
            placeholder="Brief description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Button type="submit" className="w-full">Submit for Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}