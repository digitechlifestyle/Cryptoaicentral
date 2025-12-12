import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, TrendingUp, Shield, DollarSign, Star, Zap, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const voteCategories = [
  { id: "overall", label: "Overall", icon: Star },
  { id: "ease_of_use", label: "Ease of Use", icon: Zap },
  { id: "features", label: "Features", icon: TrendingUp },
  { id: "customer_support", label: "Support", icon: HelpCircle },
  { id: "value_for_money", label: "Value", icon: DollarSign },
  { id: "security", label: "Security", icon: Shield }
];

export default function VotingPanel({ listingId }) {
  const [votes, setVotes] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadVotes();
  }, [listingId]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadVotes = async () => {
    setIsLoading(true);
    try {
      const allVotes = await base44.entities.Vote.filter({ listing_id: listingId });
      
      // Calculate vote counts per category
      const voteCounts = {};
      voteCategories.forEach(cat => {
        const categoryVotes = allVotes.filter(v => v.category === cat.id);
        const upvotes = categoryVotes.filter(v => v.vote_type === "upvote").length;
        const downvotes = categoryVotes.filter(v => v.vote_type === "downvote").length;
        voteCounts[cat.id] = { upvotes, downvotes, total: upvotes - downvotes };
      });
      
      setVotes(voteCounts);

      // Load user's votes if logged in
      if (user) {
        const myVotes = allVotes.filter(v => v.user_email === user.email);
        const myVotesMap = {};
        myVotes.forEach(v => {
          myVotesMap[v.category] = v.vote_type;
        });
        setUserVotes(myVotesMap);
      }
    } catch (error) {
      console.error("Failed to load votes:", error);
    }
    setIsLoading(false);
  };

  const handleVote = async (category, voteType) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to vote",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user already voted in this category
      const existingVotes = await base44.entities.Vote.filter({
        listing_id: listingId,
        user_email: user.email,
        category: category
      });

      // If same vote type, remove vote (toggle off)
      if (existingVotes.length > 0) {
        if (existingVotes[0].vote_type === voteType) {
          await base44.entities.Vote.delete(existingVotes[0].id);
          toast({ title: "Vote removed" });
        } else {
          // Change vote
          await base44.entities.Vote.update(existingVotes[0].id, { vote_type: voteType });
          toast({ title: "Vote updated" });
        }
      } else {
        // Create new vote
        await base44.entities.Vote.create({
          listing_id: listingId,
          user_email: user.email,
          vote_type: voteType,
          category: category
        });
        toast({ title: "Vote recorded" });
      }

      loadVotes();
    } catch (error) {
      console.error("Failed to vote:", error);
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-4">Community Ratings</h3>
        
        <div className="space-y-4">
          {voteCategories.map((category) => {
            const IconComponent = category.icon;
            const categoryVotes = votes[category.id] || { upvotes: 0, downvotes: 0, total: 0 };
            const userVote = userVotes[category.id];
            const percentage = categoryVotes.upvotes + categoryVotes.downvotes > 0
              ? Math.round((categoryVotes.upvotes / (categoryVotes.upvotes + categoryVotes.downvotes)) * 100)
              : 0;

            return (
              <div key={category.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <IconComponent className="w-5 h-5 text-slate-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{category.label}</span>
                      <span className="text-sm text-slate-600">{percentage}% positive</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant={userVote === "upvote" ? "default" : "outline"}
                    onClick={() => handleVote(category.id, "upvote")}
                    className="h-8 px-2"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {categoryVotes.upvotes}
                  </Button>
                  <Button
                    size="sm"
                    variant={userVote === "downvote" ? "default" : "outline"}
                    onClick={() => handleVote(category.id, "downvote")}
                    className="h-8 px-2"
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    {categoryVotes.downvotes}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Based on {Object.values(votes).reduce((sum, v) => sum + v.upvotes + v.downvotes, 0)} community votes
        </p>
      </CardContent>
    </Card>
  );
}