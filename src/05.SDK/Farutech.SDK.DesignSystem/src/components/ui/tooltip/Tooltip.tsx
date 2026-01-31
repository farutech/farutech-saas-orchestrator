import React from 'react';

export const Tooltip: React.FC<React.PropsWithChildren<{ content: React.ReactNode }>> = ({ children, content }) => {
  return (
    <span className="relative inline-block">
      {children}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded hidden group-hover:block">{content}</span>
    </span>
  );
};

export default Tooltip;
