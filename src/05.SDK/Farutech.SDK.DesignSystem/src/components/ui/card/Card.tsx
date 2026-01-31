import React from 'react';

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <div className={["p-4 bg-white rounded-md shadow", className].filter(Boolean).join(' ')}>{children}</div>;
};

export default Card;
