import React from 'react';

interface CharcoalDividerProps {
  className?: string;
  width?: string; // e.g. "w-full" or "w-1/2" or "w-[80%]"
}

export function CharcoalDivider({ className = '', width = 'w-[80%]' }: CharcoalDividerProps) {
  return (
    <div 
      className={`charcoal-divider h-[1px] my-6 transition-all duration-500 ${width} ${className}`}
      role="separator"
    />
  );
}
