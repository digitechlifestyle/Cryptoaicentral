import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, Loader2 } from "lucide-react";

export default function BlogScheduler({ posts, onUpdate }) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");

  const schedulePost = async (postId) => {
    if (!scheduleDate) {
      alert("Please select a date and time");
      return;
    }

    setIsScheduling(true);
    try {
      await base44.entities.BlogPost.update(postId, {
        scheduled_date: scheduleDate,
        published: false
      });
      
      alert("✅ Post scheduled successfully!");
      setSelectedPost(null);
      setScheduleDate("");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to schedule post");
    }
    setIsScheduling(false);
  };

  const publishNow = async (postId) => {
    if (!confirm("Publish this post now?")) return;

    try {
      await base44.entities.BlogPost.update(postId, {
        published: true,
        published_date: new Date().toISOString()
      });
      
      alert("✅ Post published!");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to publish post");
    }
  };

  const draftPosts = posts.filter(p => !p.published);
  const scheduledPosts = posts.filter(p => p.scheduled_date && !p.published);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Content Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scheduled Posts */}
          {scheduledPosts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Scheduled Posts ({scheduledPosts.length})</h3>
              <div className="space-y-3">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{post.title}</h4>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            Scheduled for {new Date(post.scheduled_date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => publishNow(post.id)}>
                        Publish Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Draft Posts */}
          {draftPosts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Draft Posts ({draftPosts.length})</h3>
              <div className="space-y-3">
                {draftPosts.map((post) => (
                  <div key={post.id} className="bg-slate-50 p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{post.title}</h4>
                        <Badge variant="secondary" className="mt-2">{post.category}</Badge>
                      </div>
                    </div>
                    
                    {selectedPost === post.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="datetime-local"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => schedulePost(post.id)}
                          disabled={isScheduling}
                        >
                          {isScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedPost(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedPost(post.id)}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => publishNow(post.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Publish Now
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {draftPosts.length === 0 && scheduledPosts.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>No drafts or scheduled posts</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}