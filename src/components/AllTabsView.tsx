import React from 'react';
import {
  RechargeableBrand,
  ScrapedItemDeal,
  ScrapedBrandDiscount,
  ScrapedBillingDiscount,
  TabKey,
} from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { cleanHtmlText } from '../utils/textUtils';
import {
  CreditCard,
  ShoppingBag,
  Store,
  Zap,
  SearchX,
  Layers,
  ArrowRight,
  Tag,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

const PREVIEW_COUNT = 5;

interface AllTabsViewProps {
  searchQuery: string;
  tabA: RechargeableBrand[];
  tabB: ScrapedItemDeal[];
  tabC: ScrapedBrandDiscount[];
  tabD: ScrapedBillingDiscount[];
  onNavigateCrossReference: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
  highlightedId: string | null;
  onOpenDetails: (item: any, type: 'rechargeable' | 'deal' | 'brand' | 'billing') => void;
  onSelectTab: (tab: TabKey) => void;
  onClearSearch: () => void;
}

/* ── Mini card: Tab A ── */
const MiniCardA: React.FC<{
  brand: RechargeableBrand;
  highlighted: boolean;
  onOpenDetails: (item: any, type: 'rechargeable') => void;
  onNavigateCrossReference: AllTabsViewProps['onNavigateCrossReference'];
}> = ({ brand, highlighted, onOpenDetails, onNavigateCrossReference }) => {
  const directUrl =
    brand.direct_url ||
    'https://www.max.co.il/api/umbraco/getImage?imageName=gc-ex-digital.pdf';
  return (
    <div
      id={`card-${brand.id}`}
      onClick={() => onOpenDetails(brand, 'rechargeable')}
      className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between hover:shadow-md hover:border-pink-300 dark:hover:border-pink-500/50 cursor-pointer group relative ${
        highlighted
          ? 'item-highlight-pulse bg-pink-50/40 dark:bg-pink-950/40 border-pink-500 ring-2 ring-pink-400'
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Origin badge */}
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/50">
        <CreditCard className="w-2.5 h-2.5" />
        נטען 15%
      </span>

      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5 pt-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            {brand.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
            {brand.discount}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-snug">
            {brand.name}
          </h3>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="פתח ספח תנאים רשמי (PDF)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {brand.brands && brand.brands.length > 1 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex flex-wrap gap-1">
            {brand.brands.slice(0, 4).map((sub, idx) => (
              <span
                key={idx}
                className="bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700"
              >
                {sub}
              </span>
            ))}
            {brand.brands.length > 4 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                +{brand.brands.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1 my-1.5">
          {brand.badges.slice(0, 3).map((badge, idx) => (
            <BadgePill key={idx} badge={badge} size="sm" />
          ))}
        </div>

        {brand.notes && (
          <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1">
            <AlertCircle className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span>{brand.notes}</span>
          </div>
        )}
      </div>

      {brand.cross_references && brand.cross_references.length > 0 && (
        <div className="mt-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-1">
            {brand.cross_references.slice(0, 2).map((ref, idx) => (
              <CrossReferenceTag key={idx} reference={ref} onNavigate={onNavigateCrossReference} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Mini card: Tab B ── */
const MiniCardB: React.FC<{
  deal: ScrapedItemDeal;
  highlighted: boolean;
  onOpenDetails: (item: any, type: 'deal') => void;
  onNavigateCrossReference: AllTabsViewProps['onNavigateCrossReference'];
}> = ({ deal, highlighted, onOpenDetails, onNavigateCrossReference }) => {
  const directUrl = deal.direct_url || `https://www.uniq-club.co.il/product/${deal.original_id}`;
  return (
    <div
      id={`card-${deal.id}`}
      onClick={() => onOpenDetails(deal, 'deal')}
      className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/50 cursor-pointer group relative ${
        highlighted
          ? 'item-highlight-pulse bg-emerald-50/30 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400'
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Origin badge */}
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
        <ShoppingBag className="w-2.5 h-2.5" />
        מוצר
      </span>

      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5 pt-4">
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

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
            {deal.name}
          </h3>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={`פתח את ${deal.name} באתר UNIQ`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {deal.price !== undefined && deal.price !== null && (
          <div className="flex items-baseline gap-2 mb-2 px-2 py-1 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {deal.price === 0 ? 'חינם לחברי מועדון' : `${deal.price} ₪`}
            </span>
            {deal.original_price && deal.original_price > (deal.price || 0) && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                {deal.original_price} ₪
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1 my-1.5">
          {deal.badges.slice(0, 3).map((badge, idx) => (
            <BadgePill key={idx} badge={badge} size="sm" />
          ))}
        </div>

        {deal.terms && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
            {cleanHtmlText(deal.terms)}
          </p>
        )}
      </div>

      {deal.cross_references && deal.cross_references.length > 0 && (
        <div className="mt-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-1">
            {deal.cross_references.slice(0, 2).map((ref, idx) => (
              <CrossReferenceTag key={idx} reference={ref} onNavigate={onNavigateCrossReference} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Mini card: Tab C ── */
const MiniCardC: React.FC<{
  brand: ScrapedBrandDiscount;
  highlighted: boolean;
  onOpenDetails: (item: any, type: 'brand') => void;
  onNavigateCrossReference: AllTabsViewProps['onNavigateCrossReference'];
}> = ({ brand, highlighted, onOpenDetails, onNavigateCrossReference }) => {
  const directUrl =
    brand.direct_url ||
    (brand.price !== undefined
      ? `https://www.uniq-club.co.il/product/${brand.original_id}`
      : `https://www.uniq-club.co.il/benefit/${brand.original_id}`);
  return (
    <div
      id={`card-${brand.id}`}
      onClick={() => onOpenDetails(brand, 'brand')}
      className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 cursor-pointer group relative ${
        highlighted
          ? 'item-highlight-pulse bg-indigo-50/30 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-400'
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Origin badge */}
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
        <Store className="w-2.5 h-2.5" />
        רשת
      </span>

      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5 pt-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            {brand.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            {brand.discount}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            {brand.name}
          </h3>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={`פתח את ${brand.name} באתר UNIQ`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-wrap gap-1 my-1.5">
          {brand.badges.slice(0, 3).map((badge, idx) => (
            <BadgePill key={idx} badge={badge} size="sm" />
          ))}
        </div>

        {brand.terms && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
            {cleanHtmlText(brand.terms)}
          </p>
        )}
      </div>

      {brand.cross_references && brand.cross_references.length > 0 && (
        <div className="mt-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-1">
            {brand.cross_references.slice(0, 2).map((ref, idx) => (
              <CrossReferenceTag key={idx} reference={ref} onNavigate={onNavigateCrossReference} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Mini card: Tab D ── */
const MiniCardD: React.FC<{
  item: ScrapedBillingDiscount;
  highlighted: boolean;
  onOpenDetails: (item: any, type: 'billing') => void;
  onNavigateCrossReference: AllTabsViewProps['onNavigateCrossReference'];
}> = ({ item, highlighted, onOpenDetails, onNavigateCrossReference }) => {
  const directUrl =
    item.direct_url || `https://www.uniq-club.co.il/benefit/${item.original_id}`;
  return (
    <div
      id={`card-${item.id}`}
      onClick={() => onOpenDetails(item, 'billing')}
      className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500/50 cursor-pointer group relative ${
        highlighted
          ? 'item-highlight-pulse bg-amber-50/30 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400'
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Origin badge */}
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
        <Zap className="w-2.5 h-2.5" />
        חיוב
      </span>

      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5 pt-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            {item.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            {item.discount_rate || item.discount}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug">
            {item.name}
          </h3>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={`פתח את ${item.name} באתר UNIQ`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-wrap gap-1 my-1.5">
          {item.badges.slice(0, 3).map((badge, idx) => (
            <BadgePill key={idx} badge={badge} size="sm" />
          ))}
        </div>

        {item.terms && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
            <span>{cleanHtmlText(item.terms)}</span>
          </p>
        )}
      </div>

      {item.cross_references && item.cross_references.length > 0 && (
        <div className="mt-3 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-1">
            {item.cross_references.slice(0, 2).map((ref, idx) => (
              <CrossReferenceTag key={idx} reference={ref} onNavigate={onNavigateCrossReference} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Section header + grid + "show all" CTA ── */
interface SectionProps {
  id: string;
  label: string;
  description: string;
  count: number;
  totalCount: number;
  colorKey: 'pink' | 'emerald' | 'indigo' | 'amber';
  icon: React.ReactNode;
  onShowAll: () => void;
  children: React.ReactNode;
}

const colorMap = {
  pink: {
    header: 'bg-pink-50/90 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/60',
    icon: 'bg-pink-600',
    badge: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800/60',
    cta: 'bg-pink-600 hover:bg-pink-700 text-white',
    ctaText: 'text-pink-700 dark:text-pink-300 hover:text-pink-900 dark:hover:text-pink-100 hover:bg-pink-100/60 dark:hover:bg-pink-950/60',
  },
  emerald: {
    header: 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60',
    icon: 'bg-emerald-600',
    badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    cta: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    ctaText: 'text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60',
  },
  indigo: {
    header: 'bg-indigo-50/90 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60',
    icon: 'bg-indigo-600',
    badge: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    cta: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    ctaText: 'text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/60',
  },
  amber: {
    header: 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60',
    icon: 'bg-amber-600',
    badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    cta: 'bg-amber-600 hover:bg-amber-700 text-white',
    ctaText: 'text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 hover:bg-amber-100/60 dark:hover:bg-amber-950/60',
  },
};

const SectionBlock: React.FC<SectionProps> = ({
  id,
  label,
  description,
  count,
  totalCount,
  colorKey,
  icon,
  onShowAll,
  children,
}) => {
  const c = colorMap[colorKey];
  const hasMore = totalCount > count;

  return (
    <section id={id} className="space-y-3 scroll-mt-24">
      {/* Section header */}
      <div className={`flex items-center justify-between ${c.header} border rounded-2xl p-3.5`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl ${c.icon} text-white flex items-center justify-center shrink-0`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
              {label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${c.badge}`}>
            {totalCount} תוצאות
          </span>
          <button
            onClick={onShowAll}
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${c.ctaText}`}
            title={`עבור לצפייה מלאה ב${label}`}
          >
            <span className="hidden sm:inline">הצג רק לשונית זו</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>

      {/* Preview grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>

      {/* "Show all" CTA — only when results are truncated */}
      {hasMore && (
        <div className="flex justify-center pt-1">
          <button
            onClick={onShowAll}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer ${c.cta}`}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>הצג את כל {totalCount} התוצאות בלשונית זו</span>
          </button>
        </div>
      )}
    </section>
  );
};

/* ══════════════════════════════════
   Main AllTabsView
══════════════════════════════════ */
export const AllTabsView: React.FC<AllTabsViewProps> = ({
  searchQuery,
  tabA,
  tabB,
  tabC,
  tabD,
  onNavigateCrossReference,
  highlightedId,
  onOpenDetails,
  onSelectTab,
  onClearSearch,
}) => {
  const totalResults = tabA.length + tabB.length + tabC.length + tabD.length;

  if (totalResults === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs transition-colors">
        <SearchX className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          לא נמצאו תוצאות באף אחת מ-4 הלשוניות
        </h3>
        {searchQuery ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
            לא אותרו הטבות או מותגים התואמים לחיפוש &quot;
            <strong className="text-slate-700 dark:text-slate-300">{searchQuery}</strong>
            &quot;. נסה לחפש שם רשת כללי (למשל: פוקס, שופרסל, הום סנטר) או לנקות את הסינון.
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            לא אותרו פריטים המתאימים לסינונים הנוכחיים.
          </p>
        )}
        <button
          onClick={onClearSearch}
          className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold hover:bg-pink-700 transition-colors cursor-pointer"
        >
          נקה חיפוש וסינונים
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="all-tabs-view">
      {/* ── Summary overview bar ── */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:via-pink-950/30 dark:to-slate-900 border border-pink-200/90 dark:border-pink-900/50 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                תוצאות חיפוש בכל 4 הלשוניות
                {searchQuery && (
                  <span className="font-normal text-slate-600 dark:text-slate-400">
                    {' '}
                    עבור &quot;<strong className="text-pink-700 dark:text-pink-300 font-bold">{searchQuery}</strong>&quot;
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                סה&quot;כ <strong className="text-slate-800 dark:text-slate-200 font-semibold">{totalResults}</strong> הטבות נמצאו במאגר המשולב
                {totalResults > PREVIEW_COUNT && (
                  <span className="text-slate-400 dark:text-slate-500"> · מוצגות {Math.min(PREVIEW_COUNT, tabA.length) + Math.min(PREVIEW_COUNT, tabB.length) + Math.min(PREVIEW_COUNT, tabC.length) + Math.min(PREVIEW_COUNT, tabD.length)} תוצאות מובילות</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick breakdown pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
            {tabA.length > 0 && (
              <button
                onClick={() => {
                  const el = document.getElementById('all-tabs-section-A');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-900/60 text-pink-700 dark:text-pink-300 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-xs transition-all cursor-pointer"
              >
                <CreditCard className="w-3 h-3" />
                נטען ({tabA.length})
              </button>
            )}
            {tabB.length > 0 && (
              <button
                onClick={() => {
                  const el = document.getElementById('all-tabs-section-B');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                מוצרים ({tabB.length})
              </button>
            )}
            {tabC.length > 0 && (
              <button
                onClick={() => {
                  const el = document.getElementById('all-tabs-section-C');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer"
              >
                <Store className="w-3 h-3" />
                רשתות ({tabC.length})
              </button>
            )}
            {tabD.length > 0 && (
              <button
                onClick={() => {
                  const el = document.getElementById('all-tabs-section-D');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer"
              >
                <Zap className="w-3 h-3" />
                חיוב ({tabD.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Section A: כרטיס נטען 15% ── */}
      {tabA.length > 0 && (
        <SectionBlock
          id="all-tabs-section-A"
          label="לשונית א׳: כרטיס נטען 15% הנחה"
          description="רשתות ומותגים הנטענים מראש בהנחה קבועה של 15% (מאומת מול ספח Max)"
          count={Math.min(PREVIEW_COUNT, tabA.length)}
          totalCount={tabA.length}
          colorKey="pink"
          icon={<CreditCard className="w-4 h-4" />}
          onShowAll={() => onSelectTab('A')}
        >
          {tabA.slice(0, PREVIEW_COUNT).map((brand) => (
            <MiniCardA
              key={brand.id}
              brand={brand}
              highlighted={highlightedId === brand.id}
              onOpenDetails={onOpenDetails}
              onNavigateCrossReference={onNavigateCrossReference}
            />
          ))}
        </SectionBlock>
      )}

      {/* ── Section B: הטבות לפי מוצר ── */}
      {tabB.length > 0 && (
        <SectionBlock
          id="all-tabs-section-B"
          label="לשונית ב׳: הטבות לפי מוצר"
          description="שוברים, כרטיסים ומוצרים במחירי מועדון מסונכרנים חי מאתר UNIQ"
          count={Math.min(PREVIEW_COUNT, tabB.length)}
          totalCount={tabB.length}
          colorKey="emerald"
          icon={<ShoppingBag className="w-4 h-4" />}
          onShowAll={() => onSelectTab('B')}
        >
          {tabB.slice(0, PREVIEW_COUNT).map((deal) => (
            <MiniCardB
              key={deal.id}
              deal={deal}
              highlighted={highlightedId === deal.id || highlightedId === deal.original_id}
              onOpenDetails={onOpenDetails}
              onNavigateCrossReference={onNavigateCrossReference}
            />
          ))}
        </SectionBlock>
      )}

      {/* ── Section C: הנחות רשתות ומותגים ── */}
      {tabC.length > 0 && (
        <SectionBlock
          id="all-tabs-section-C"
          label="לשונית ג׳: הנחות רשתות ומותגים"
          description="מבצעים והנחות ברשתות מובילות, אתרי אונליין וסניפים פיזיים"
          count={Math.min(PREVIEW_COUNT, tabC.length)}
          totalCount={tabC.length}
          colorKey="indigo"
          icon={<Store className="w-4 h-4" />}
          onShowAll={() => onSelectTab('C')}
        >
          {tabC.slice(0, PREVIEW_COUNT).map((brand) => (
            <MiniCardC
              key={brand.id}
              brand={brand}
              highlighted={highlightedId === brand.id || highlightedId === brand.original_id}
              onOpenDetails={onOpenDetails}
              onNavigateCrossReference={onNavigateCrossReference}
            />
          ))}
        </SectionBlock>
      )}

      {/* ── Section D: הנחות במעמד החיוב ── */}
      {tabD.length > 0 && (
        <SectionBlock
          id="all-tabs-section-D"
          label="לשונית ד׳: הנחות במעמד החיוב"
          description="הנחות אוטומטיות בדף פירוט חיובי האשראי (ללא צורך בשובר או קופון)"
          count={Math.min(PREVIEW_COUNT, tabD.length)}
          totalCount={tabD.length}
          colorKey="amber"
          icon={<Zap className="w-4 h-4" />}
          onShowAll={() => onSelectTab('D')}
        >
          {tabD.slice(0, PREVIEW_COUNT).map((item) => (
            <MiniCardD
              key={item.id}
              item={item}
              highlighted={highlightedId === item.id || highlightedId === item.original_id}
              onOpenDetails={onOpenDetails}
              onNavigateCrossReference={onNavigateCrossReference}
            />
          ))}
        </SectionBlock>
      )}
    </div>
  );
};
