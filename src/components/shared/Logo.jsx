import React from 'react';

export default function Logo({ className }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
          <stop offset="100%" style={{ stopColor: '#6366F1' }} />
        </linearGradient>
        <linearGradient id="logo-gradient-indigo" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#4F46E5' }} />
          <stop offset="100%" style={{ stopColor: '#818CF8' }} />
        </linearGradient>
      </defs>
      
      {/* Crypto Element (Hexagon/Block) */}
      <path
        d="M20 3L37.32 13V31L20 41L2.68 31V13L20 3Z"
        fill="none"
        stroke="url(#logo-gradient-indigo)"
        strokeWidth="2"
        opacity="0.6"
      />
      
      {/* AI Element (Nodes/Circuits) */}
      <g transform="translate(2, 2)">
        <path
          d="M18 10L6 16.928L6 30.856L18 37.784L30 30.856L30 16.928L18 10Z"
          fill="url(#logo-gradient-blue)"
          opacity="0.2"
        />
        <path
          d="M18 0.216L30 7.144L30 21.072L18 28L6 21.072L6 7.144L18 0.216Z"
          fill="none"
          stroke="url(#logo-gradient-blue)"
          strokeWidth="2"
        />
        <circle cx="18" cy="18" r="4" fill="white" />
        <circle cx="18" cy="18" r="2" fill="url(#logo-gradient-blue)" />
        
        <circle cx="18" cy="0.216" r="2" fill="url(#logo-gradient-blue)" />
        <circle cx="6" cy="7.144" r="2" fill="url(#logo-gradient-blue)" />
        <circle cx="30" cy="7.144" r="2" fill="url(#logo-gradient-blue)" />
        <circle cx="6" cy="21.072" r="2" fill="url(#logo-gradient-blue)" />
        <circle cx="30" cy="21.072" r="2" fill="url(#logo-gradient-blue)" />
        <circle cx="18" cy="28" r="2" fill="url(#logo-gradient-blue)" />
      </g>
    </svg>
  );
}