import React from 'react';

export const Avatar: React.FC<{ src?: string; alt?: string; size?: number }> = ({ src, alt, size = 32 }) => {
  return (
    <img src={src} alt={alt} width={size} height={size} className="rounded-full object-cover" />
  );
};

export default Avatar;
