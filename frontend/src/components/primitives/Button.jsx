import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const sizeClass = size === 'sm'
    ? 'px-4 py-2 text-sm'
    : size === 'lg'
      ? 'px-8 py-4 text-lg'
      : 'px-6 py-3';

  const variantClasses = {
    primary: 'bg-primary text-on-primary rounded-lg font-semibold hover:brightness-110 active:scale-95 transition-all duration-200',
    secondary: 'border border-outline-variant text-on-surface rounded-lg font-semibold hover:bg-surface-container-low/55 transition-all duration-200',
    ghost: 'text-on-surface hover:bg-surface-container-low/50 rounded-lg font-medium transition-all duration-200'
  }[variant];

  const variantSize = {
    primary: 'font-semibold',
    secondary: 'font-semibold',
    ghost: 'font-medium'
  }[variant];

  return (
    <button
      className={`
        ${sizeClass}
        rounded-lg
        ${variantClasses}
        ${variantSize}
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md'
};

export default Button;