import React from 'react';
import { CrossReference, TabKey } from '../types';
import { ArrowUpLeft, Sparkles, CreditCard, ShoppingBag, Store, Zap } from 'lucide-react';

interface CrossReferenceTagProps {
  reference: CrossReference;
  onNavigate: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
}

export const CrossReferenceTag: React.FC<CrossReferenceTagProps> = ({
  reference,
  onNavigate,
}) => {
  const getTabDetails = (tab: TabKey) => {
    switch (tab) {
      case 'A':
        return {
          name: 'כרטיס נטען 15%',
          icon: CreditCard,
          color: 'bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800/60 hover:bg-pink-100 dark:hover:bg-pink-900/40',
        };
      case 'B':
        return {
          name: 'הטבות מוצר',
          icon: ShoppingBag,
          color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
        };
      case 'C':
        return {
          name: 'הנחות מותגים',
          icon: Store,
          color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
        };
      case 'D':
        return {
          name: 'הנחה במעמד החיוב',
          icon: Zap,
          color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40',
        };
    }
  };

  const details = getTabDetails(reference.tab);
  const IconComponent = details.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate(reference.tab, reference.name, reference.target_id);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border shadow-xs transition-all duration-150 cursor-pointer ${details.color} active:scale-95`}
      title={`עבור ל${details.name}: הצג הטבה עבור ${reference.name}`}
    >
      <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
      <IconComponent className="w-3.5 h-3.5" />
      <span>{reference.label || `תקף גם ב${details.name}`}</span>
      <ArrowUpLeft className="w-3 h-3 opacity-70" />
    </button>
  );
};
