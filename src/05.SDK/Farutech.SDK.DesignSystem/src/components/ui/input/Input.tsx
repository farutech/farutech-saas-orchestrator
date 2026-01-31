import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {};

export const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  return <input className={['px-3 py-2 border rounded-md', className].filter(Boolean).join(' ')} {...rest} />;
};

export default Input;
