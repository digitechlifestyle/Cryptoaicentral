import React, { useEffect } from 'react';
import { Analytics } from '@/api/entities';

export default function AnalyticsTracker({ eventType, listingId, metadata = {} }) {
  useEffect(() => {
    const trackEvent = async () => {
      try {
        // Generate session ID if not exists
        let sessionId = sessionStorage.getItem('analytics_session');
        if (!sessionId) {
          sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
          sessionStorage.setItem('analytics_session', sessionId);
        }

        // Throttle analytics calls to prevent rate limiting
        const trackingKey = `${eventType}_${listingId}_${sessionId}`;
        const lastTracked = sessionStorage.getItem(`last_tracked_${trackingKey}`);
        const now = Date.now();
        
        // Only track if it's been more than 10 seconds since last track for the same event
        if (lastTracked && (now - parseInt(lastTracked)) < 10000) {
          return;
        }

        await Analytics.create({
          event_type: eventType,
          listing_id: listingId,
          session_id: sessionId,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            page_url: window.location.href
          }
        });

        // Store the timestamp of successful tracking
        sessionStorage.setItem(`last_tracked_${trackingKey}`, now.toString());
      } catch (error) {
        // Silently fail - don't break user experience
        // Use console.log instead of console.debug for better browser compatibility
        console.log('Analytics tracking failed:', error);
      }
    };

    // Add a small delay to prevent immediate firing
    const timeoutId = setTimeout(trackEvent, 1000);
    
    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [eventType, listingId, metadata]);

  return null; // This component doesn't render anything
}