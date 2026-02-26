import React, {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import './ui.css';

interface BaseButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

type NativeButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
  };

type AnchorButtonProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

type ButtonProps = NativeButtonProps | AnchorButtonProps;

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  as = 'button',
  className,
  ...props 
}) => {
  const classes = clsx(
    'btn', 
    `btn-${variant}`, 
    `btn-${size}`, 
    { 'w-full': fullWidth },
    className
  );

  if (as === 'a') {
    const anchorProps = props as AnchorButtonProps;
    return (
      <a className={classes} data-variant={variant} {...anchorProps}>
        <span className="btn-label">{children}</span>
      </a>
    );
  }

  return (
    <button 
      className={classes}
      data-variant={variant}
      {...(props as NativeButtonProps)}
    >
      <span className="btn-label">{children}</span>
    </button>
  );
};
