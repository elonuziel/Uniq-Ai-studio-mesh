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
          color: 'bg-pink-50 text-pink-700 border-pink-300 hover:bg-pink-100',
        };
      case 'B':
        return {
          name: 'הטבות מוצר',
          icon: ShoppingBag,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100',
        };
      case 'C':
        return {
          name: 'הנחות מותגים',
          icon: Store,
          color: 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100',
        };
      case 'D':
        return {
          name: 'הנחה במעמד החיוב',
          icon: Zap,
          color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
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
