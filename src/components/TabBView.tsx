import React from 'react';
import { ScrapedItemDeal, TabKey } from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { ShoppingBag, Tag, ChevronLeft } from 'lucide-react';

interface TabBViewProps {
  deals: ScrapedItemDeal[];
  onNavigateCrossReference: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
  highlightedId: string | null;
  onOpenDetails: (item: any, type: 'deal') => void;
}

export const TabBView: React.FC<TabBViewProps> = ({
  deals,
  onNavigateCrossReference,
  highlightedId,
  onOpenDetails,
}) => {
  if (deals.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 mb-1">לא נמצאו הטבות מוצר מתאימות</h3>
        <p className="text-sm text-slate-500">נסה לחפש מוצר אחר או להסיר סינונים פעילים.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {deals.map((deal) => {
        const isHighlighted = highlightedId === deal.id || highlightedId === deal.original_id;

        return (
          <div
            key={deal.id}
            id={`card-${deal.id}`}
            onClick={() => onOpenDetails(deal, 'deal')}
            className={`bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 cursor-pointer group relative ${
              isHighlighted
                ? 'item-highlight-pulse bg-emerald-50/30 border-emerald-500 ring-2 ring-emerald-400'
                : 'border-slate-200/90'
            }`}
          >
            <div>
              {/* Header: Category & Discount */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {deal.category}
                </span>

                {deal.discount && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {deal.discount}
                  </span>
                )}
              </div>

              {/* Title & Chevron */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 flex items-start justify-between gap-2">
                <span>{deal.name}</span>
                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:-translate-x-1 transition-all shrink-0 mt-1" />
              </h3>

              {/* Pricing Box if available */}
              {(deal.price !== undefined && deal.price !== null) && (
                <div className="flex items-baseline gap-2.5 mb-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-bold text-slate-900">
                    {deal.price === 0 ? 'חינם לחברי מועדון' : `${deal.price} ₪`}
                  </div>
                  {deal.original_price && deal.original_price > (deal.price || 0) && (
                    <div className="text-xs text-slate-400 line-through">
                      מחיר רגיל: {deal.original_price} ₪
                    </div>
                  )}
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 my-2">
                {deal.badges.map((badge, idx) => (
                  <BadgePill key={idx} badge={badge} size="sm" />
                ))}
              </div>

              {/* Description preview */}
              {deal.terms && (
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 pt-2 border-t border-slate-100">
                  {deal.terms}
                </p>
              )}
            </div>

            {/* Cross-References */}
            {deal.cross_references && deal.cross_references.length > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  הצלבות מקבילות:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {deal.cross_references.map((ref, idx) => (
                    <CrossReferenceTag
                      key={idx}
                      reference={ref}
                      onNavigate={onNavigateCrossReference}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
