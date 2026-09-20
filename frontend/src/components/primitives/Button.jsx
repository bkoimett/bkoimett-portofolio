import React from 'react';

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-7 py-3.5 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantClass = {
    primary: 'btn-primary',
    stroke: 'btn-stroke',
    ghost: 'btn-ghost',
  }[variant];

  return (
    <button
      className={`btn ${variantClass} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;