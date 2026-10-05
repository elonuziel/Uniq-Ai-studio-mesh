import React from 'react';
import { ScrapedBillingDiscount, TabKey } from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { Zap, Tag, ExternalLink, CheckCircle2 } from 'lucide-react';

interface TabDViewProps {
  discounts: ScrapedBillingDiscount[];
  onNavigateCrossReference: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
  highlightedId: string | null;
  onOpenDetails: (item: any, type: 'billing') => void;
}

export const TabDView: React.FC<TabDViewProps> = ({
  discounts,
  onNavigateCrossReference,
  highlightedId,
  onOpenDetails,
}) => {
  if (discounts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 mb-1">לא נמצאו הנחות במעמד החיוב</h3>
        <p className="text-sm text-slate-500">נסה לחפש בית עסק אחר או לנקות את תיבת החיפוש.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Informative Header Banner for Tab D */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-5 flex items-start gap-3 text-amber-900">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="text-xs md:text-sm">
          <h4 className="font-bold text-amber-950 mb-0.5">
            כיצד פועלות הנחות במעמד החיוב?
          </h4>
          <p className="text-amber-800/90 leading-relaxed">
            משלמים כרגיל באמצעות כרטיס האשראי UNIQ בקופה או באתר בית העסק, וההנחה (בין 1% ל-50%) מנוכה באופן אוטומטי בדף החשבון החודשי שלכם בחברת האשראי. אין צורך בהצגת קופון!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((item) => {
          const isHighlighted = highlightedId === item.id || highlightedId === item.original_id;
          const directUrl = item.direct_url || `https://www.uniq-club.co.il/benefit/${item.original_id}`;

          return (
            <div
              key={item.id}
              id={`card-${item.id}`}
              onClick={() => onOpenDetails(item, 'billing')}
              className={`bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-md hover:border-amber-300 cursor-pointer group relative ${
                isHighlighted
                  ? 'item-highlight-pulse bg-amber-50/30 border-amber-500 ring-2 ring-amber-400'
                  : 'border-slate-200/90'
              }`}
            >
              <div>
                {/* Category & Discount Rate */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {item.category}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Zap className="w-3 h-3 text-amber-600" />
                    {item.discount_rate || item.discount}
                  </span>
                </div>

                {/* Title & Direct Site Link */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors shrink-0"
                    title={`פתח את ${item.name} באתר UNIQ`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 my-2.5">
                  {item.badges.map((badge, idx) => (
                    <BadgePill key={idx} badge={badge} size="sm" />
                  ))}
                </div>

                {/* Benefit description */}
                {item.terms && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 pt-2 border-t border-slate-100 flex items-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item.terms}</span>
                  </p>
                )}
              </div>

              {/* Cross-References */}
              {item.cross_references && item.cross_references.length > 0 && (
                <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                  <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                    הצלבות מועדון נוספות:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.cross_references.map((ref, idx) => (
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
    </div>
  );
};
