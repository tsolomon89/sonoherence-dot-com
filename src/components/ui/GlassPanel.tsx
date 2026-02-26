import React, { type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './ui.css';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { children, className, glow = false, padding = 'md', ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx('glass-panel', `p-${padding}`, { glow }, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
