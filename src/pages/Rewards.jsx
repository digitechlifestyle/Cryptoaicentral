import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gift, Star, Trophy, Zap, CheckCircle, Clock, X, TrendingUp, Share2, MousePointerClick, UserPlus, ShieldCheck, DollarSign, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SeoMeta from "../components/shared/SeoMeta";

const fallbackRewards = [
  { id: "reward-featured-credit", reward_name: "Featured Listing Credit", reward_description: "Use points toward a featured placement or profile boost when listings are open.", points_required: 1000, reward_value: "Visibility boost" },
  { id: "reward-newsletter-mention", reward_name: "Newsletter Mention", reward_description: "Redeem points for a curated mention in a future Crypto AI Central newsletter slot.", points_required: 1500, reward_value: "Promotion" },
  { id: "reward-sponsored-discount", reward_name: "Sponsored Listing Discount", reward_description: "Use points as credit against sponsored listing or advertising packages.", points_required: 2500, reward_value: "Ad credit" },
  { id: "reward-premium-guide", reward_name: "Premium Guide Access", reward_description: "Redeem points for future premium research guides, templates or comparison reports.", points_required: 750, reward_value: "Digital access" }
];

const fundingModel = [
  { title: "AdSense revenue pool", icon: DollarSign, text: "A small monthly percentage of advertising income can fund non-cash rewards and limited promotional credits." },
  { title: "Affiliate commission pool", icon: TrendingUp, text: "When users drive qualified traffic or signups that generate commission, part of that value can support the rewards pool." },
  { title: "Sponsored listings", icon: Megaphone, text: "Sponsors can fund reward campaigns such as featured badges, ad credits, newsletter mentions and partner offers." },
  { title: "Non-cash rewards first", icon: Gift, text: "Start with listing credits, profile boosts, newsletter mentions, premium guide access and sponsor discounts before cash rewards." }
];

const antiAbuseRules = [
  "Daily points caps for shares, clicks and signups.",
  "No points for self-clicking, bots, spam traffic or repeated fake activity.",
  "Clicks should be unique, time-filtered and checked for basic fraud signals.",
  "Signup rewards should require verified email and minimum engagement.",
  "All redemptions should remain pending until admin review.",
  "Cash-equivalent rewards should only be added once funding and compliance are clear."
];

export default function RewardsPage() {
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [rewards, setRewards] = useState(fallbackRewards);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser?.email) {
        const pointsData = await base44.entities.UserPoints.filter({ user_email: currentUser.email });
        if (pointsData.length > 0) {
          setUserPoints(pointsData[0]);
        } else {
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

        const rewardsData = await base44.entities.PointsReward.filter({ active: true }, "-points_required", 50);
        if (rewardsData.length) setRewards(rewardsData);

        const historyData = await base44.entities.RedemptionHistory.filter({ user_email: currentUser.email }, "-created_date", 20);
        setRedemptionHistory(historyData);

        const allPoints = await base44.entities.UserPoints.list("-lifetime_points", 10);
        setLeaderboard(allPoints);
      }
    } catch (error) {
      console.error("Rewards data unavailable, showing public fallback model:", error);
      setUser(null);
      setUserPoints(null);
      setRewards(fallbackRewards);
      setLeaderboard([]);
    }
  };

  const handleRedeem = async (reward) => {
    if (!user) {
      alert("Please log in before redeeming rewards.");
      return;
    }
    if (!userPoints || userPoints.available_points < reward.points_required) {
      alert("Not enough points to redeem this reward!");
      return;
    }
    if (!window.confirm(`Redeem ${reward.reward_name} for ${reward.points_required} points?`)) return;
    setIsRedeeming(true);
    try {
      await base44.entities.RedemptionHistory.create({ user_email: user.email, reward_id: reward.id, reward_name: reward.reward_name, points_spent: reward.points_required, status: 'pending' });
      await base44.entities.UserPoints.update(userPoints.id, { available_points: userPoints.available_points - reward.points_required });
      alert("✅ Redemption request submitted. An admin will review it shortly.");
      await loadData();
    } catch (error) {
      console.error("Redemption failed:", error);
      alert("Failed to redeem reward. Please try again.");
    }
    setIsRedeeming(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-yellow-50/20 p-6">
      <SeoMeta title="Rewards Program | Crypto AI Central" description="Learn how Crypto AI Central rewards work, how users earn points, how rewards are funded, and the anti-abuse rules behind the system." keywords="crypto rewards program, Web3 loyalty, referral points, affiliate rewards, sponsored listings" />
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4"><Gift className="w-8 h-8 text-purple-600" /><h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">Share & Earn Rewards</h1></div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">Earn points for useful engagement, referrals and qualified traffic. Rewards are designed to be funded by ads, affiliates and sponsors — not vague promises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"><CardHeader><CardTitle className="text-white text-sm font-medium">Available Points</CardTitle></CardHeader><CardContent><div className="text-4xl font-bold">{userPoints?.available_points || 0}</div><p className="text-purple-100 text-sm mt-1">Ready to redeem</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-600" />Shares</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-slate-900">{userPoints?.shares_count || 0}</div><p className="text-slate-500 text-sm mt-1">+10 points each</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-green-600" />Qualified Clicks</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-slate-900">{userPoints?.clicks_generated || 0}</div><p className="text-slate-500 text-sm mt-1">+25 points each</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium flex items-center gap-2"><UserPlus className="w-4 h-4 text-purple-600" />Verified Signups</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-slate-900">{userPoints?.signups_generated || 0}</div><p className="text-slate-500 text-sm mt-1">+100 points each</p></CardContent></Card>
        </div>

        <Alert className="border-blue-500 bg-blue-50"><TrendingUp className="h-5 w-5 text-blue-600" /><AlertTitle className="text-blue-800 font-bold">How points are earned</AlertTitle><AlertDescription className="text-blue-700 space-y-3 mt-2"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><strong>Share content:</strong> +10 points for sharing useful guides, tools or project pages.</div><div><strong>Qualified clicks:</strong> +25 points when a unique real visitor clicks your shared link.</div><div><strong>Verified signups:</strong> +100 points when a real user signs up from your referral.</div></div><div className="p-3 bg-white rounded-lg"><strong>Important:</strong> Points are engagement credits. Redemptions are reviewed manually and may be rejected for spam, bots, duplicate accounts or suspicious activity.</div></AlertDescription></Alert>

        <section><h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><DollarSign className="w-6 h-6 text-green-600" />How the rewards are funded</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{fundingModel.map((item) => { const Icon = item.icon; return <Card key={item.title}><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Icon className="w-5 h-5 text-purple-600" />{item.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-600">{item.text}</p></CardContent></Card>; })}</div></section>

        <section><h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-blue-600" />Anti-abuse and sustainability rules</h2><Card><CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">{antiAbuseRules.map((rule) => <div key={rule} className="flex items-start gap-2 text-slate-700"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" /><span>{rule}</span></div>)}</CardContent></Card></section>

        <div><h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Star className="w-6 h-6 text-yellow-500" />Available Rewards</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{rewards.map((reward) => { const canAfford = userPoints && userPoints.available_points >= reward.points_required; return <Card key={reward.id} className={`relative overflow-hidden ${canAfford ? 'border-green-500' : ''}`}>{canAfford && <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">You can afford this!</div>}<CardHeader><CardTitle className="flex items-center gap-2"><Gift className="w-5 h-5 text-purple-600" />{reward.reward_name}</CardTitle><CardDescription>{reward.reward_description}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><Badge className="bg-purple-100 text-purple-800 text-lg px-4 py-1">{reward.points_required} points</Badge><Badge variant="outline" className="text-sm">{reward.reward_value}</Badge></div><Button onClick={() => handleRedeem(reward)} disabled={!canAfford || isRedeeming} className="w-full" variant={canAfford ? 'default' : 'outline'}>{canAfford ? 'Redeem Now' : `Need ${reward.points_required - (userPoints?.available_points || 0)} more points`}</Button></CardContent></Card>; })}</div></div>

        {redemptionHistory.length > 0 && <div><h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Clock className="w-6 h-6 text-blue-600" />Your Redemptions</h2><Card><CardContent className="p-0"><div className="divide-y">{redemptionHistory.map((redemption) => <div key={redemption.id} className="p-4 flex items-center justify-between"><div><div className="font-semibold text-slate-900">{redemption.reward_name}</div><div className="text-sm text-slate-500">{new Date(redemption.created_date).toLocaleDateString()} • {redemption.points_spent} points</div></div><Badge variant={redemption.status === 'completed' ? 'default' : redemption.status === 'pending' ? 'secondary' : redemption.status === 'approved' ? 'default' : 'destructive'}>{redemption.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}{redemption.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}{redemption.status === 'rejected' && <X className="w-3 h-3 mr-1" />}{redemption.status}</Badge></div>)}</div></CardContent></Card></div>}

        {leaderboard.length > 0 && <div><h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" />Top Sharers Leaderboard</h2><Card><CardContent className="p-0"><div className="divide-y">{leaderboard.map((entry, index) => <div key={entry.id} className="p-4 flex items-center gap-4"><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-slate-400 text-white' : index === 2 ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{index + 1}</div><div className="flex-1"><div className="font-semibold text-slate-900">{entry.user_email === user?.email ? 'You' : entry.user_email.split('@')[0]}</div><div className="text-sm text-slate-500">{entry.shares_count} shares • {entry.clicks_generated} clicks • {entry.signups_generated} signups</div></div><div className="text-right"><div className="text-2xl font-bold text-purple-600">{entry.lifetime_points}</div><div className="text-xs text-slate-500">lifetime points</div></div></div>)}</div></CardContent></Card></div>}

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><CardContent className="p-8 text-center"><Zap className="w-12 h-12 mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">Start Earning Points</h3><p className="mb-6 text-purple-100">Share useful content, drive qualified traffic and redeem points for promotional benefits once approved.</p><div className="flex gap-4 justify-center flex-wrap"><Link to={createPageUrl("Blog")}><Button variant="secondary" size="lg">Share Blog Posts</Button></Link><Link to={createPageUrl("Browse")}><Button variant="secondary" size="lg">Browse Guides</Button></Link></div></CardContent></Card>
      </div>
    </div>
  );
}
