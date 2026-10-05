import React from 'react';
import { RechargeableBrand, TabKey } from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { CreditCard, Tag, ExternalLink, AlertCircle } from 'lucide-react';

interface TabAViewProps {
  brands: RechargeableBrand[];
  onNavigateCrossReference: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
  highlightedId: string | null;
  onOpenDetails: (item: any, type: 'rechargeable') => void;
}

export const TabAView: React.FC<TabAViewProps> = ({
  brands,
  onNavigateCrossReference,
  highlightedId,
  onOpenDetails,
}) => {
  if (brands.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 mb-1">לא נמצאו רשתות מתאימות</h3>
        <p className="text-sm text-slate-500">נסה לשנות את מילות החיפוש או לאפס את הסינון.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands.map((brand) => {
        const isHighlighted = highlightedId === brand.id;
        const directUrl =
          brand.direct_url ||
          'https://www.max.co.il/api/umbraco/getImage?imageName=gc-ex-digital.pdf';

        return (
          <div
            key={brand.id}
            id={`card-${brand.id}`}
            onClick={() => onOpenDetails(brand, 'rechargeable')}
            className={`bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-md hover:border-pink-300 cursor-pointer group relative ${
              isHighlighted
                ? 'item-highlight-pulse bg-pink-50/40 border-pink-500 ring-2 ring-pink-400'
                : 'border-slate-200/90'
            }`}
          >
            {/* Top Bar: Category & Discount Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {brand.category}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  {brand.discount}
                </span>
              </div>

              {/* Brand Name & Direct PDF Link */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors leading-snug">
                  {brand.name}
                </h3>
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors shrink-0"
                  title="פתח ספח תנאים רשמי (PDF)"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Sub-brands if multiple */}
              {brand.brands && brand.brands.length > 1 && (
                <div className="text-xs text-slate-500 mb-3 flex flex-wrap gap-1">
                  <span className="font-semibold text-slate-600">כולל:</span>
                  {brand.brands.slice(0, 6).map((sub, idx) => (
                    <span key={idx} className="bg-slate-50 px-1.5 py-0.5 rounded text-[11px] text-slate-600 border border-slate-100">
                      {sub}
                    </span>
                  ))}
                  {brand.brands.length > 6 && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      +{brand.brands.length - 6} נוספים
                    </span>
                  )}
                </div>
              )}

              {/* Restrictions & Visual Badges */}
              <div className="flex flex-wrap gap-1.5 my-3">
                {brand.badges.map((badge, idx) => (
                  <BadgePill key={idx} badge={badge} size="sm" />
                ))}
              </div>

              {/* Key Notes / Caveats preview */}
              {brand.notes && (
                <div className="text-xs text-slate-600 line-clamp-2 mt-2 pt-2 border-t border-slate-100 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{brand.notes}</span>
                </div>
              )}
            </div>

            {/* Bottom: Cross-References if present */}
            {brand.cross_references && brand.cross_references.length > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  הצלבות והטבות מקבילות במועדון:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brand.cross_references.map((ref, idx) => (
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
