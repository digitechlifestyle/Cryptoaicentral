import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false,
  onLoad,
  fallback = null 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError && fallback) {
    return fallback;
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        style={isLoading ? { opacity: 0 } : { opacity: 1, transition: 'opacity 0.3s' }}
      />
    </div>
  );
}