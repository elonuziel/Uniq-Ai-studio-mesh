import React from 'react';
import { Badge } from '../types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface BadgePillProps {
  badge: Badge;
  size?: 'sm' | 'md';
}

export const BadgePill: React.FC<BadgePillProps> = ({ badge, size = 'sm' }) => {
  const isSm = size === 'sm';
  const pyClass = isSm ? 'py-0.5 px-2 text-xs' : 'py-1 px-2.5 text-xs md:text-sm';

  switch (badge.type) {
    case 'red':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-md ${pyClass}`}
          title={badge.text}
        >
          <AlertCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{badge.text}</span>
        </span>
      );
    case 'yellow':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-md ${pyClass}`}
          title={badge.text}
        >
          <AlertTriangle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{badge.text}</span>
        </span>
      );
    case 'blue':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-md ${pyClass}`}
          title={badge.text}
        >
          <Info className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{badge.text}</span>
        </span>
      );
    case 'slate':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md ${pyClass}`}
          title={badge.text}
        >
          <CheckCircle2 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{badge.text}</span>
        </span>
      );
  }
};
