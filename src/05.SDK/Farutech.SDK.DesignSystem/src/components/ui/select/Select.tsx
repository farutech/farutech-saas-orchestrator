import React from 'react';

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...rest }) => {
  return (
    <select className="px-3 py-2 border rounded-md" {...rest}>
      {children}
    </select>
  );
};

export default Select;
