import React from 'react';
import { RechargeableBrand, TabKey } from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { CreditCard, Tag, ExternalLink, AlertCircle } from 'lucide-react';

interface TabAViewProps {
  brands: RechargeableBrand[];
  viewMode?: 'cards' | 'table';
  onNavigateCrossReference: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
  highlightedId: string | null;
  onOpenDetails: (item: any, type: 'rechargeable') => void;
}

export const TabAView: React.FC<TabAViewProps> = ({
  brands,
  viewMode = 'cards',
  onNavigateCrossReference,
  highlightedId,
  onOpenDetails,
}) => {
  if (brands.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs transition-colors">
        <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">לא נמצאו רשתות מתאימות</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">נסה לשנות את מילות החיפוש או לאפס את הסינון.</p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <table className="w-full text-right text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold">
              <th className="py-3 px-4">שם המותג / הרשת</th>
              <th className="py-3 px-4">קטגוריה</th>
              <th className="py-3 px-4">שיעור הנחה</th>
              <th className="py-3 px-4">מגבלות והערות</th>
              <th className="py-3 px-4">הצלבות / פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {brands.map((brand) => {
              const isHighlighted = highlightedId === brand.id;
              const directUrl =
                brand.direct_url ||
                'https://www.max.co.il/api/umbraco/getImage?imageName=gc-ex-digital.pdf';

              return (
                <tr
                  key={brand.id}
                  id={`card-${brand.id}`}
                  onClick={() => onOpenDetails(brand, 'rechargeable')}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    isHighlighted
                      ? 'bg-pink-50/60 dark:bg-pink-950/40 font-semibold'
                      : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{brand.name}</span>
                      <a
                        href={directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors p-0.5"
                        title="פתח ספח תנאים רשמי (PDF)"
                      >
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </a>
                    </div>
                    {brand.brands && brand.brands.length > 1 && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        כולל: {brand.brands.slice(0, 4).join(', ')}
                        {brand.brands.length > 4 && ` +${brand.brands.length - 4}`}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {brand.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
                      {brand.discount}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {brand.badges.map((badge, idx) => (
                        <BadgePill key={idx} badge={badge} size="sm" />
                      ))}
                    </div>
                    {brand.notes && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {brand.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {brand.cross_references && brand.cross_references.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {brand.cross_references.map((ref, idx) => (
                          <CrossReferenceTag
                            key={idx}
                            reference={ref}
                            onNavigate={onNavigateCrossReference}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-xs">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
            className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-md hover:border-pink-300 dark:hover:border-pink-500/50 cursor-pointer group relative ${
              isHighlighted
                ? 'item-highlight-pulse bg-pink-50/40 dark:bg-pink-950/40 border-pink-500 ring-2 ring-pink-400'
                : 'border-slate-200/90 dark:border-slate-800'
            }`}
          >
            {/* Top Bar: Category & Discount Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  {brand.category}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
                  {brand.discount}
                </span>
              </div>

              {/* Brand Name & Direct PDF Link */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-snug">
                  {brand.name}
                </h3>
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                  title="פתח ספח תנאים רשמי (PDF)"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Sub-brands if multiple */}
              {brand.brands && brand.brands.length > 1 && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">כולל:</span>
                  {brand.brands.slice(0, 6).map((sub, idx) => (
                    <span key={idx} className="bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                      {sub}
                    </span>
                  ))}
                  {brand.brands.length > 6 && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
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
                <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                  <span>{brand.notes}</span>
                </div>
              )}
            </div>

            {/* Bottom: Cross-References if present */}
            {brand.cross_references && brand.cross_references.length > 0 && (
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
                <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
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
