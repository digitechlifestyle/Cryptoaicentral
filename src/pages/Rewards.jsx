import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gift, Star, Trophy, Zap, CheckCircle, Clock, X, TrendingUp, Share2, MousePointerClick, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RewardsPage() {
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Load user points
      const pointsData = await base44.entities.UserPoints.filter({ user_email: currentUser.email });
      if (pointsData.length > 0) {
        setUserPoints(pointsData[0]);
      } else {
        // Create initial points record
        const newPoints = await base44.entities.UserPoints.create({
          user_email: currentUser.email,
          total_points: 0,
          available_points: 0,
          lifetime_points: 0,
          shares_count: 0,
          clicks_generated: 0,
          signups_generated: 0
        });
        setUserPoints(newPoints);
      }

      // Load available rewards
      const rewardsData = await base44.entities.PointsReward.filter({ active: true }, "-points_required", 50);
      setRewards(rewardsData);

      // Load redemption history
      const historyData = await base44.entities.RedemptionHistory.filter({ user_email: currentUser.email }, "-created_date", 20);
      setRedemptionHistory(historyData);

      // Load leaderboard
      const allPoints = await base44.entities.UserPoints.list("-lifetime_points", 10);
      setLeaderboard(allPoints);

    } catch (error) {
      console.error("Failed to load rewards data:", error);
      await base44.auth.redirectToLogin(window.location.href);
    }
    setIsLoading(false);
  };

  const handleRedeem = async (reward) => {
    if (!userPoints || userPoints.available_points < reward.points_required) {
      alert("Not enough points to redeem this reward!");
      return;
    }

    if (!window.confirm(`Redeem ${reward.reward_name} for ${reward.points_required} points?`)) {
      return;
    }

    setIsRedeeming(true);
    try {
      // Create redemption request
      await base44.entities.RedemptionHistory.create({
        user_email: user.email,
        reward_id: reward.id,
        reward_name: reward.reward_name,
        points_spent: reward.points_required,
        status: 'pending'
      });

      // Deduct points (admin will restore if they reject)
      await base44.entities.UserPoints.update(userPoints.id, {
        available_points: userPoints.available_points - reward.points_required
      });

      alert("✅ Redemption request submitted! An admin will review it shortly.");
      await loadData();
    } catch (error) {
      console.error("Redemption failed:", error);
      alert("Failed to redeem reward. Please try again.");
    }
    setIsRedeeming(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-yellow-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-yellow-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
              Share & Earn Rewards
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Share our directory, earn points, and redeem exclusive rewards!
          </p>
        </div>

        {/* Points Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-white text-sm font-medium">Available Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{userPoints?.available_points || 0}</div>
              <p className="text-purple-100 text-sm mt-1">Ready to redeem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                Shares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{userPoints?.shares_count || 0}</div>
              <p className="text-slate-500 text-sm mt-1">+10 points each</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-green-600" />
                Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{userPoints?.clicks_generated || 0}</div>
              <p className="text-slate-500 text-sm mt-1">+25 points each</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-600" />
                Signups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{userPoints?.signups_generated || 0}</div>
              <p className="text-slate-500 text-sm mt-1">+100 points each</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Alert className="border-blue-500 bg-blue-50">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 font-bold">How to Earn Points</AlertTitle>
          <AlertDescription className="text-blue-700 space-y-2 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <Share2 className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-bold">Share Content</div>
                  <div className="text-sm">Share blog posts, projects, or pages = <strong>+10 points</strong></div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MousePointerClick className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-bold">Get Clicks</div>
                  <div className="text-sm">Someone clicks your shared link = <strong>+25 points</strong></div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UserPlus className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-bold">Drive Signups</div>
                  <div className="text-sm">Someone signs up from your link = <strong>+100 points</strong></div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <strong>💡 Pro Tip:</strong> Look for share buttons throughout the site on blog posts, project pages, and more!
            </div>
          </AlertDescription>
        </Alert>

        {/* Available Rewards */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Available Rewards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canAfford = userPoints && userPoints.available_points >= reward.points_required;
              
              return (
                <Card key={reward.id} className={`relative overflow-hidden ${canAfford ? 'border-green-500' : ''}`}>
                  {canAfford && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                      You can afford this!
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-600" />
                      {reward.reward_name}
                    </CardTitle>
                    <CardDescription>{reward.reward_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-1">
                        {reward.points_required} points
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {reward.reward_value}
                      </Badge>
                    </div>

                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford || isRedeeming}
                      className="w-full"
                      variant={canAfford ? 'default' : 'outline'}
                    >
                      {canAfford ? 'Redeem Now' : `Need ${reward.points_required - (userPoints?.available_points || 0)} more points`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Redemption History */}
        {redemptionHistory.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Your Redemptions
            </h2>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {redemptionHistory.map((redemption) => (
                    <div key={redemption.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{redemption.reward_name}</div>
                        <div className="text-sm text-slate-500">
                          {new Date(redemption.created_date).toLocaleDateString()} • {redemption.points_spent} points
                        </div>
                      </div>
                      <Badge
                        variant={
                          redemption.status === 'completed' ? 'default' :
                          redemption.status === 'pending' ? 'secondary' :
                          redemption.status === 'approved' ? 'default' : 'destructive'
                        }
                      >
                        {redemption.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {redemption.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {redemption.status === 'rejected' && <X className="w-3 h-3 mr-1" />}
                        {redemption.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Top Sharers Leaderboard
          </h2>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {leaderboard.map((entry, index) => (
                  <div key={entry.id} className="p-4 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-slate-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">
                        {entry.user_email === user?.email ? 'You' : entry.user_email.split('@')[0]}
                      </div>
                      <div className="text-sm text-slate-500">
                        {entry.shares_count} shares • {entry.clicks_generated} clicks • {entry.signups_generated} signups
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{entry.lifetime_points}</div>
                      <div className="text-xs text-slate-500">lifetime points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start Earning CTA */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Start Earning Points Now!</h3>
            <p className="mb-6 text-purple-100">Share content across the site and watch your points grow</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to={createPageUrl("Home")}>
                <Button variant="secondary" size="lg">
                  Browse & Share
                </Button>
              </Link>
              <Link to={createPageUrl("Blog")}>
                <Button variant="secondary" size="lg">
                  Share Blog Posts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}