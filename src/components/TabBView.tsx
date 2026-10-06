import React from 'react';
import { ScrapedItemDeal, TabKey } from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { cleanHtmlText } from '../utils/textUtils';
import { ShoppingBag, Tag, ExternalLink } from 'lucide-react';

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
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs transition-colors">
        <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">לא נמצאו הטבות מוצר מתאימות</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">נסה לחפש מוצר אחר או להסיר סינונים פעילים.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {deals.map((deal) => {
        const isHighlighted = highlightedId === deal.id || highlightedId === deal.original_id;
        const directUrl = deal.direct_url || `https://www.uniq-club.co.il/product/${deal.original_id}`;

        return (
          <div
            key={deal.id}
            id={`card-${deal.id}`}
            onClick={() => onOpenDetails(deal, 'deal')}
            className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/50 cursor-pointer group relative ${
              isHighlighted
                ? 'item-highlight-pulse bg-emerald-50/30 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400'
                : 'border-slate-200/90 dark:border-slate-800'
            }`}
          >
            <div>
              {/* Header: Category & Discount */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  {deal.category}
                </span>

                {deal.discount && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    {deal.discount}
                  </span>
                )}
              </div>

              {/* Title & Direct Site Link */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {deal.name}
                </h3>
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                  title={`פתח את ${deal.name} באתר UNIQ`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Pricing Box if available */}
              {(deal.price !== undefined && deal.price !== null) && (
                <div className="flex items-baseline gap-2.5 mb-3 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {deal.price === 0 ? 'חינם לחברי מועדון' : `${deal.price} ₪`}
                  </div>
                  {deal.original_price && deal.original_price > (deal.price || 0) && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 line-through">
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
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {cleanHtmlText(deal.terms)}
                </p>
              )}
            </div>

            {/* Cross-References */}
            {deal.cross_references && deal.cross_references.length > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
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
