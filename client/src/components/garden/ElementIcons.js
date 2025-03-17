/**
 * SVG icons for garden elements
 */
import React from 'react';

// SVG icons for each element type
const ElementIcons = {
  raisedBed: (
    <svg viewBox="0 0 100 100">
      <rect x="10" y="10" width="80" height="80" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
      <rect x="15" y="15" width="70" height="70" fill="#A1887F" stroke="#5D4037" strokeWidth="1" />
    </svg>
  ),
  flatBed: (
    <svg viewBox="0 0 100 100">
      <rect x="10" y="40" width="80" height="20" fill="#A5D6A7" stroke="#4CAF50" strokeWidth="2" />
    </svg>
  ),
  path: (
    <svg viewBox="0 0 100 100">
      <rect x="10" y="40" width="80" height="20" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="2" />
      <line x1="20" y1="50" x2="80" y2="50" stroke="#BDBDBD" strokeWidth="2" strokeDasharray="5,5" />
    </svg>
  ),
  fence: (
    <svg viewBox="0 0 100 100">
      <line x1="20" y1="30" x2="20" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="40" y1="30" x2="40" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="60" y1="30" x2="60" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="80" y1="30" x2="80" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="10" y1="40" x2="90" y2="40" stroke="#795548" strokeWidth="4" />
      <line x1="10" y1="60" x2="90" y2="60" stroke="#795548" strokeWidth="4" />
    </svg>
  ),
  shed: (
    <svg viewBox="0 0 100 100">
      <polygon points="50,20 80,40 80,80 20,80 20,40" fill="#90A4AE" stroke="#607D8B" strokeWidth="2" />
      <rect x="45" y="60" width="15" height="20" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
      <rect x="30" y="50" width="10" height="10" fill="#BBDEFB" stroke="#2196F3" strokeWidth="1" />
      <rect x="65" y="50" width="10" height="10" fill="#BBDEFB" stroke="#2196F3" strokeWidth="1" />
    </svg>
  ),
  tomato: (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="#F44336" stroke="#D32F2F" strokeWidth="2" />
      <path d="M50,20 L50,35" stroke="#4CAF50" strokeWidth="3" />
      <path d="M50,35 C40,25 30,35 30,45" stroke="#4CAF50" strokeWidth="2" />
      <path d="M50,35 C60,25 70,35 70,45" stroke="#4CAF50" strokeWidth="2" />
    </svg>
  ),
  carrot: (
    <svg viewBox="0 0 100 100">
      <path d="M50,25 L60,40 Q65,70 50,85 Q35,70 40,40 Z" fill="#FF9800" stroke="#E65100" strokeWidth="2" />
      <path d="M50,20 L45,5 M50,20 L55,8 M50,20 L60,15" stroke="#4CAF50" strokeWidth="2" />
    </svg>
  ),
  lettuce: (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="#8BC34A" stroke="#689F38" strokeWidth="2" />
      <path d="M30,40 Q50,35 70,40" stroke="#689F38" strokeWidth="2" fill="none" />
      <path d="M30,50 Q50,45 70,50" stroke="#689F38" strokeWidth="2" fill="none" />
      <path d="M30,60 Q50,55 70,60" stroke="#689F38" strokeWidth="2" fill="none" />
    </svg>
  ),
  appleTree: (
    <svg viewBox="0 0 100 100">
      <rect x="45" y="50" width="10" height="30" fill="#795548" stroke="#5D4037" strokeWidth="2" />
      <circle cx="50" cy="40" r="25" fill="#4CAF50" stroke="#388E3C" strokeWidth="2" />
      <circle cx="40" cy="35" r="5" fill="#F44336" stroke="#D32F2F" strokeWidth="1" />
      <circle cx="60" cy="35" r="5" fill="#F44336" stroke="#D32F2F" strokeWidth="1" />
      <circle cx="50" cy="55" r="5" fill="#F44336" stroke="#D32F2F" strokeWidth="1" />
    </svg>
  ),
  cherryTree: (
    <svg viewBox="0 0 100 100">
      <rect x="45" y="50" width="10" height="30" fill="#795548" stroke="#5D4037" strokeWidth="2" />
      <circle cx="50" cy="40" r="25" fill="#4CAF50" stroke="#388E3C" strokeWidth="2" />
      <circle cx="40" cy="30" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
      <circle cx="55" cy="25" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
      <circle cx="60" cy="40" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
      <circle cx="45" cy="45" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
    </svg>
  ),
  bush: (
    <svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="60" rx="30" ry="25" fill="#66BB6A" stroke="#388E3C" strokeWidth="2" />
      <circle cx="40" cy="50" r="10" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />
      <circle cx="60" cy="55" r="12" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />
      <circle cx="50" cy="70" r="8" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />
    </svg>
  ),
  bench: (
    <svg viewBox="0 0 100 100">
      <rect x="20" y="40" width="60" height="10" fill="#A1887F" stroke="#795548" strokeWidth="2" />
      <rect x="25" y="50" width="5" height="20" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
      <rect x="70" y="50" width="5" height="20" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
    </svg>
  ),
  pond: (
    <svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="50" rx="30" ry="20" fill="#90CAF9" stroke="#2196F3" strokeWidth="2" />
      <path d="M40,45 Q45,40 50,45 Q55,50 60,45" fill="none" stroke="#64B5F6" strokeWidth="1" />
    </svg>
  )
};

export default ElementIcons;