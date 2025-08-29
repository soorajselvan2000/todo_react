// src/components/BackgroundWrapper.js
import React from 'react';

const BackgroundWrapper = ({ children }) => {
  return (
    <div 
      className="min-vh-100"
      style={{
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgba(243, 244, 246, 0.8);stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(209, 213, 219, 0.8);stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(%23gradient)" /></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper;