import React from 'react';
import { ScrapedBrandDiscount, TabKey } from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { Store, Tag, ExternalLink } from 'lucide-react';

interface TabCViewProps {
  brands: ScrapedBrandDiscount[];
  onNavigateCrossReference: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
  highlightedId: string | null;
  onOpenDetails: (item: any, type: 'brand') => void;
}

export const TabCView: React.FC<TabCViewProps> = ({
  brands,
  onNavigateCrossReference,
  highlightedId,
  onOpenDetails,
}) => {
  if (brands.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 mb-1">לא נמצאו הנחות רשתות מתאימות</h3>
        <p className="text-sm text-slate-500">נסה לחפש רשת אחרת או לאפס סינונים.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands.map((brand) => {
        const isHighlighted = highlightedId === brand.id || highlightedId === brand.original_id;
        const directUrl =
          brand.direct_url ||
          (brand.price !== undefined
            ? `https://www.uniq-club.co.il/product/${brand.original_id}`
            : `https://www.uniq-club.co.il/benefit/${brand.original_id}`);

        return (
          <div
            key={brand.id}
            id={`card-${brand.id}`}
            onClick={() => onOpenDetails(brand, 'brand')}
            className={`bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 cursor-pointer group relative ${
              isHighlighted
                ? 'item-highlight-pulse bg-indigo-50/30 border-indigo-500 ring-2 ring-indigo-400'
                : 'border-slate-200/90'
            }`}
          >
            <div>
              {/* Category & Discount */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {brand.category}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {brand.discount}
                </span>
              </div>

              {/* Title & Direct Site Link */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                  {brand.name}
                </h3>
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors shrink-0"
                  title={`פתח את ${brand.name} באתר UNIQ`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 my-2.5">
                {brand.badges.map((badge, idx) => (
                  <BadgePill key={idx} badge={badge} size="sm" />
                ))}
              </div>

              {/* Terms Preview */}
              {brand.terms && (
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 pt-2 border-t border-slate-100">
                  {brand.terms}
                </p>
              )}
            </div>

            {/* Cross-References */}
            {brand.cross_references && brand.cross_references.length > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  הצלבות והטבות מקבילות:
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
