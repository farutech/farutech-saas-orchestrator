import React from 'react';

export const Table: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <table className={["min-w-full", className].filter(Boolean).join(' ')}>{children}</table>;
};

export default Table;
