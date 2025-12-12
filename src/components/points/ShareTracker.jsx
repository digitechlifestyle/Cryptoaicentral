import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Generate unique share code for tracking
const generateShareCode = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const trackShare = async (platform, contentType, contentId = null) => {
  try {
    const user = await base44.auth.me().catch(() => null);
    if (!user) return null;

    const shareCode = generateShareCode();
    
    // Award 10 points for sharing
    await base44.entities.ShareEvent.create({
      user_email: user.email,
      share_code: shareCode,
      event_type: 'share_clicked',
      platform: platform,
      shared_url: window.location.href,
      shared_content_type: contentType,
      shared_content_id: contentId,
      points_awarded: 10
    });

    // Update user points
    const userPoints = await base44.entities.UserPoints.filter({ user_email: user.email });
    if (userPoints.length > 0) {
      const current = userPoints[0];
      await base44.entities.UserPoints.update(current.id, {
        total_points: current.total_points + 10,
        available_points: current.available_points + 10,
        lifetime_points: current.lifetime_points + 10,
        shares_count: current.shares_count + 1
      });
    } else {
      await base44.entities.UserPoints.create({
        user_email: user.email,
        total_points: 10,
        available_points: 10,
        lifetime_points: 10,
        shares_count: 1,
        clicks_generated: 0,
        signups_generated: 0
      });
    }

    return shareCode;
  } catch (error) {
    console.error("Failed to track share:", error);
    return null;
  }
};

export const trackClick = async (shareCode) => {
  try {
    // Find the original share event
    const shareEvents = await base44.entities.ShareEvent.filter({ share_code: shareCode });
    if (shareEvents.length === 0) return;

    const originalShare = shareEvents[0];
    
    // Award 25 points for click
    await base44.entities.ShareEvent.create({
      user_email: originalShare.user_email,
      share_code: shareCode,
      event_type: 'link_clicked',
      platform: originalShare.platform,
      shared_url: originalShare.shared_url,
      shared_content_type: originalShare.shared_content_type,
      shared_content_id: originalShare.shared_content_id,
      points_awarded: 25
    });

    // Update user points
    const userPoints = await base44.entities.UserPoints.filter({ user_email: originalShare.user_email });
    if (userPoints.length > 0) {
      const current = userPoints[0];
      await base44.entities.UserPoints.update(current.id, {
        total_points: current.total_points + 25,
        available_points: current.available_points + 25,
        lifetime_points: current.lifetime_points + 25,
        clicks_generated: current.clicks_generated + 1
      });
    }
  } catch (error) {
    console.error("Failed to track click:", error);
  }
};

export const trackSignup = async (shareCode) => {
  try {
    // Find the original share event
    const shareEvents = await base44.entities.ShareEvent.filter({ share_code: shareCode });
    if (shareEvents.length === 0) return;

    const originalShare = shareEvents[0];
    
    // Award 100 points for signup
    await base44.entities.ShareEvent.create({
      user_email: originalShare.user_email,
      share_code: shareCode,
      event_type: 'signup_completed',
      platform: originalShare.platform,
      shared_url: originalShare.shared_url,
      shared_content_type: originalShare.shared_content_type,
      shared_content_id: originalShare.shared_content_id,
      points_awarded: 100
    });

    // Update user points
    const userPoints = await base44.entities.UserPoints.filter({ user_email: originalShare.user_email });
    if (userPoints.length > 0) {
      const current = userPoints[0];
      await base44.entities.UserPoints.update(current.id, {
        total_points: current.total_points + 100,
        available_points: current.available_points + 100,
        lifetime_points: current.lifetime_points + 100,
        signups_generated: current.signups_generated + 1
      });
    }
  } catch (error) {
    console.error("Failed to track signup:", error);
  }
};

export default function ShareTracker() {
  useEffect(() => {
    // Check for share code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const shareCode = urlParams.get('sc');
    
    if (shareCode) {
      // Track the click
      trackClick(shareCode);
      
      // Store share code for signup tracking
      localStorage.setItem('shareCode', shareCode);
    }
  }, []);

  return null;
}