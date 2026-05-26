import { useEffect } from 'react';

export default function SeoMeta({ 
  title = "CryptoAiCentral.com", 
  description = "Discover and explore the cutting edge of cryptocurrency and artificial intelligence. Your comprehensive guide to the best AI trading bots, DeFi protocols, wallets, exchanges, and blockchain tools.",
  keywords = "",
  image = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a4f92bbde_logo.png",
  url,
  structuredData
}) {
  useEffect(() => {
    const fullTitle = title === "CryptoAiCentral.com" ? title : `${title} | CryptoAiCentral.com`;
    const canonicalUrl = url || window.location.href;

    document.title = fullTitle;

    const setMetaTag = (attributes, content) => {
      let selector = 'meta';
      let attributeKey = null;
      let attributeValue = null;

      if (attributes.name) {
        selector = `meta[name="${attributes.name}"]`;
        attributeKey = 'name';
        attributeValue = attributes.name;
      } else if (attributes.property) {
        selector = `meta[property="${attributes.property}"]`;
        attributeKey = 'property';
        attributeValue = attributes.property;
      }

      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (attributeKey && attributeValue) element.setAttribute(attributeKey, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    const setStructuredData = (data) => {
      const id = 'crypto-ai-central-structured-data';
      let element = document.getElementById(id);
      if (!data) {
        if (element) element.remove();
        return;
      }
      if (!element) {
        element = document.createElement('script');
        element.id = id;
        element.type = 'application/ld+json';
        document.head.appendChild(element);
      }
      element.textContent = JSON.stringify(data);
    };

    setMetaTag({ name: 'description' }, description);
    if (keywords) setMetaTag({ name: 'keywords' }, keywords);
    setLinkTag('canonical', canonicalUrl);

    setMetaTag({ property: 'og:title' }, fullTitle);
    setMetaTag({ property: 'og:description' }, description);
    setMetaTag({ property: 'og:image' }, image);
    setMetaTag({ property: 'og:url' }, canonicalUrl);
    setMetaTag({ property: 'og:type' }, structuredData?.['@type'] === 'Article' ? 'article' : 'website');

    setMetaTag({ name: 'twitter:card' }, 'summary_large_image');
    setMetaTag({ name: 'twitter:title' }, fullTitle);
    setMetaTag({ name: 'twitter:description' }, description);
    setMetaTag({ name: 'twitter:image' }, image);

    setMetaTag({ name: 'viewport' }, 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    setMetaTag({ name: 'mobile-web-app-capable' }, 'yes');
    setMetaTag({ name: 'apple-mobile-web-app-capable' }, 'yes');
    setMetaTag({ name: 'apple-mobile-web-app-status-bar-style' }, 'black-translucent');
    setStructuredData(structuredData);

  }, [title, description, keywords, image, url, structuredData]);

  return null;
}
