import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function GoogleAd({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block', textAlign: 'center' }
}) {
  const adRef = useRef(null);
  const [publisherId, setPublisherId] = useState('ca-pub-YOUR_PUBLISHER_ID');

  useEffect(() => {
    const loadPublisherId = async () => {
      try {
        const settings = await base44.entities.SiteSettings.list().catch(() => []);
        if (settings.length > 0 && settings[0].google_adsense_publisher_id) {
          setPublisherId(settings[0].google_adsense_publisher_id);
        }
      } catch (error) {
        console.error('Failed to load AdSense Publisher ID:', error);
      }
    };

    loadPublisherId();
  }, []);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current && publisherId !== 'ca-pub-YOUR_PUBLISHER_ID') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.log('AdSense error:', error);
    }
  }, [publisherId]);

  return (
    <div className="ad-container my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}