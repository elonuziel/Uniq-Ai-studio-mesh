import React, { useState } from 'react';
import {
  RechargeableBrand,
  ScrapedItemDeal,
  ScrapedBrandDiscount,
  ScrapedBillingDiscount,
  TabKey,
} from '../types';
import { TabAView } from './TabAView';
import { TabBView } from './TabBView';
import { TabCView } from './TabCView';
import { TabDView } from './TabDView';
import {
  CreditCard,
  ShoppingBag,
  Store,
  Zap,
  SearchX,
  Layers,
  ArrowRight,
} from 'lucide-react';

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
  const [selectedSection, setSelectedSection] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');

  const totalResults = tabA.length + tabB.length + tabC.length + tabD.length;

  if (totalResults === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <SearchX className="w-14 h-14 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          לא נמצאו תוצאות באף אחת מ-4 הלשוניות
        </h3>
        {searchQuery ? (
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            לא אותרו הטבות או מותגים התואמים לחיפוש &quot;
            <strong className="text-slate-700">{searchQuery}</strong>
            &quot;. נסה לחפש שם רשת כללי (למשל: פוקס, שופרסל, הום סנטר) או לנקות את הסינון.
          </p>
        ) : (
          <p className="text-sm text-slate-500 mb-4">
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

  const scrollToSection = (sectionId: string) => {
    if (selectedSection !== 'ALL') {
      setSelectedSection('ALL');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="space-y-8" data-testid="all-tabs-view">
      {/* Top Multi-Tab Overview Bar */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200/90 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                תוצאות חיפוש בכל 4 הלשוניות
                {searchQuery && (
                  <span className="font-normal text-slate-600">
                    {' '}
                    עבור &quot;<strong className="text-pink-700 font-bold">{searchQuery}</strong>&quot;
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                סה&quot;כ <strong className="text-slate-800 font-semibold">{totalResults}</strong> הטבות
                נמצאו במאגר המשולב
              </p>
            </div>
          </div>

          {/* Quick Section View Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 hidden lg:inline">סנן תצוגה:</span>
            <button
              onClick={() => setSelectedSection('ALL')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedSection === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/60'
              }`}
            >
              הכל ({totalResults})
            </button>
            <button
              onClick={() => setSelectedSection('A')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedSection === 'A'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white/80 text-pink-700 hover:bg-white border border-pink-200/60'
              }`}
            >
              נטען ({tabA.length})
            </button>
            <button
              onClick={() => setSelectedSection('B')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedSection === 'B'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/80 text-emerald-700 hover:bg-white border border-emerald-200/60'
              }`}
            >
              מוצרים ({tabB.length})
            </button>
            <button
              onClick={() => setSelectedSection('C')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedSection === 'C'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/80 text-indigo-700 hover:bg-white border border-indigo-200/60'
              }`}
            >
              רשתות ({tabC.length})
            </button>
            <button
              onClick={() => setSelectedSection('D')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedSection === 'D'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white/80 text-amber-700 hover:bg-white border border-amber-200/60'
              }`}
            >
              חיוב ({tabD.length})
            </button>
          </div>
        </div>

        {/* Quick-Jump Breakdown Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-pink-100/80">
          {/* Tab A Pill */}
          <button
            onClick={() => scrollToSection('all-tabs-section-A')}
            className={`p-2 rounded-xl text-right transition-all flex items-center justify-between border cursor-pointer ${
              tabA.length > 0
                ? 'bg-white border-pink-200 hover:border-pink-300 hover:shadow-xs'
                : 'bg-slate-50/60 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">כרטיס נטען 15%</span>
            </div>
            <span
              className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                tabA.length > 0 ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {tabA.length}
            </span>
          </button>

          {/* Tab B Pill */}
          <button
            onClick={() => scrollToSection('all-tabs-section-B')}
            className={`p-2 rounded-xl text-right transition-all flex items-center justify-between border cursor-pointer ${
              tabB.length > 0
                ? 'bg-white border-emerald-200 hover:border-emerald-300 hover:shadow-xs'
                : 'bg-slate-50/60 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">הטבות מוצר</span>
            </div>
            <span
              className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                tabB.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {tabB.length}
            </span>
          </button>

          {/* Tab C Pill */}
          <button
            onClick={() => scrollToSection('all-tabs-section-C')}
            className={`p-2 rounded-xl text-right transition-all flex items-center justify-between border cursor-pointer ${
              tabC.length > 0
                ? 'bg-white border-indigo-200 hover:border-indigo-300 hover:shadow-xs'
                : 'bg-slate-50/60 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">רשתות ומותגים</span>
            </div>
            <span
              className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                tabC.length > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {tabC.length}
            </span>
          </button>

          {/* Tab D Pill */}
          <button
            onClick={() => scrollToSection('all-tabs-section-D')}
            className={`p-2 rounded-xl text-right transition-all flex items-center justify-between border cursor-pointer ${
              tabD.length > 0
                ? 'bg-white border-amber-200 hover:border-amber-300 hover:shadow-xs'
                : 'bg-slate-50/60 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800">במעמד החיוב</span>
            </div>
            <span
              className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                tabD.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {tabD.length}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION A: כרטיס נטען 15% */}
      {(selectedSection === 'ALL' || selectedSection === 'A') && tabA.length > 0 && (
        <section id="all-tabs-section-A" className="space-y-3 scroll-mt-24">
          <div className="flex items-center justify-between bg-pink-50/90 border border-pink-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  לשונית א&apos;: כרטיס נטען 15% הנחה
                </h3>
                <p className="text-xs text-slate-500">
                  רשתות ומותגים הנטענים מראש בהנחה קבועה של 15% (מאומת מול ספח Max)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                {tabA.length} תוצאות
              </span>
              <button
                onClick={() => onSelectTab('A')}
                className="inline-flex items-center gap-1 text-xs text-pink-700 font-bold hover:text-pink-900 hover:underline px-2 py-1 rounded-lg hover:bg-pink-100/60 transition-colors cursor-pointer"
                title="עבור לצפייה מלאה בלשונית כרטיס נטען"
              >
                <span>הצג רק לשונית זו</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>

          <TabAView
            brands={tabA}
            onNavigateCrossReference={onNavigateCrossReference}
            highlightedId={highlightedId}
            onOpenDetails={onOpenDetails}
          />
        </section>
      )}

      {/* SECTION B: הטבות לפי מוצר */}
      {(selectedSection === 'ALL' || selectedSection === 'B') && tabB.length > 0 && (
        <section id="all-tabs-section-B" className="space-y-3 scroll-mt-24">
          <div className="flex items-center justify-between bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  לשונית ב&apos;: הטבות לפי מוצר
                </h3>
                <p className="text-xs text-slate-500">
                  שוברים, כרטיסים ומוצרים במחירי מועדון מסונכרנים חי מאתר UNIQ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {tabB.length} תוצאות
              </span>
              <button
                onClick={() => onSelectTab('B')}
                className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold hover:text-emerald-950 hover:underline px-2 py-1 rounded-lg hover:bg-emerald-100/60 transition-colors cursor-pointer"
                title="עבור לצפייה מלאה בלשונית הטבות לפי מוצר"
              >
                <span>הצג רק לשונית זו</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>

          <TabBView
            deals={tabB}
            onNavigateCrossReference={onNavigateCrossReference}
            highlightedId={highlightedId}
            onOpenDetails={onOpenDetails}
          />
        </section>
      )}

      {/* SECTION C: הנחות רשתות ומותגים */}
      {(selectedSection === 'ALL' || selectedSection === 'C') && tabC.length > 0 && (
        <section id="all-tabs-section-C" className="space-y-3 scroll-mt-24">
          <div className="flex items-center justify-between bg-indigo-50/90 border border-indigo-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  לשונית ג&apos;: הנחות רשתות ומותגים
                </h3>
                <p className="text-xs text-slate-500">
                  מבצעים והנחות ברשתות מובילות, אתרי אונליין וסניפים פיזיים
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                {tabC.length} תוצאות
              </span>
              <button
                onClick={() => onSelectTab('C')}
                className="inline-flex items-center gap-1 text-xs text-indigo-700 font-bold hover:text-indigo-900 hover:underline px-2 py-1 rounded-lg hover:bg-indigo-100/60 transition-colors cursor-pointer"
                title="עבור לצפייה מלאה בלשונית הנחות רשתות ומותגים"
              >
                <span>הצג רק לשונית זו</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>

          <TabCView
            brands={tabC}
            onNavigateCrossReference={onNavigateCrossReference}
            highlightedId={highlightedId}
            onOpenDetails={onOpenDetails}
          />
        </section>
      )}

      {/* SECTION D: הנחות במעמד החיוב */}
      {(selectedSection === 'ALL' || selectedSection === 'D') && tabD.length > 0 && (
        <section id="all-tabs-section-D" className="space-y-3 scroll-mt-24">
          <div className="flex items-center justify-between bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  לשונית ד&apos;: הנחות במעמד החיוב
                </h3>
                <p className="text-xs text-slate-500">
                  הנחות אוטומטיות בדף פירוט חיובי האשראי (ללא צורך בשובר או קופון)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {tabD.length} תוצאות
              </span>
              <button
                onClick={() => onSelectTab('D')}
                className="inline-flex items-center gap-1 text-xs text-amber-800 font-bold hover:text-amber-950 hover:underline px-2 py-1 rounded-lg hover:bg-amber-100/60 transition-colors cursor-pointer"
                title="עבור לצפייה מלאה בלשונית הנחות במעמד החיוב"
              >
                <span>הצג רק לשונית זו</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>

          <TabDView
            discounts={tabD}
            onNavigateCrossReference={onNavigateCrossReference}
            highlightedId={highlightedId}
            onOpenDetails={onOpenDetails}
          />
        </section>
      )}
    </div>
  );
};
