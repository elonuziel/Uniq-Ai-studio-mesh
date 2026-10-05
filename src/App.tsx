import React, { useState, useEffect, useMemo } from 'react';
import {
  TabKey,
  FilterState,
  RechargeableDataset,
  ScrapedDataset,
  RechargeableBrand,
  ScrapedItemDeal,
  ScrapedBrandDiscount,
  ScrapedBillingDiscount,
} from './types';
import { Navbar } from './components/Navbar';
import { GlobalRulesCard } from './components/GlobalRulesCard';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { TabAView } from './components/TabAView';
import { TabBView } from './components/TabBView';
import { TabCView } from './components/TabCView';
import { TabDView } from './components/TabDView';
import { DetailModal } from './components/DetailModal';
import { isDataStale, getDaysDifference } from './utils/dateUtils';
import { Loader2, RefreshCw, ExternalLink, ShieldCheck, Sparkles, X, AlertTriangle } from 'lucide-react';

const INITIAL_FILTER: FilterState = {
  searchQuery: '',
  selectedCategory: '',
  onlyWithCrossReferences: false,
  selectedBadgeType: null,
  selectedSort: 'default',
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('A');
  const [rechargeableData, setRechargeableData] = useState<RechargeableDataset | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [crossRefNotification, setCrossRefNotification] = useState<{
    brandName: string;
    fromTab: string;
  } | null>(null);

  const [modalItem, setModalItem] = useState<{
    item: any;
    type: 'rechargeable' | 'deal' | 'brand' | 'billing';
  } | null>(null);

  const [showStaleBanner, setShowStaleBanner] = useState<boolean>(true);

  // Load datasets on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // Try both relative and root path to support local dev and GitHub Pages base paths
        const fetchFile = async (fileName: string) => {
          const paths = [`./data/${fileName}`, `/data/${fileName}`, `data/${fileName}`];
          for (const path of paths) {
            try {
              const res = await fetch(path);
              if (res.ok) {
                return await res.json();
              }
            } catch {
              // try next path
            }
          }
          throw new Error(`Failed to load ${fileName}`);
        };

        const [rec, scraped] = await Promise.all([
          fetchFile('rechargeable_benefits.json'),
          fetchFile('scraped_benefits.json'),
        ]);

        setRechargeableData(rec);
        setScrapedData(scraped);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setLoadError('שגיאה בטעינת נתוני ההטבות. ודא כי קובצי הנתונים נוצרו בהצלחה.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Remove highlight after a few seconds
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  // Cross-reference navigation handler
  const handleNavigateCrossReference = (targetTab: TabKey, filterBrandName: string, targetId?: string) => {
    setActiveTab(targetTab);
    setFilter({
      ...INITIAL_FILTER,
      searchQuery: filterBrandName,
    });
    if (targetId) {
      setHighlightedId(targetId);
    }
    setCrossRefNotification({
      brandName: filterBrandName,
      fromTab: activeTab === 'A' ? 'כרטיס נטען' : activeTab === 'B' ? 'הטבות מוצר' : activeTab === 'C' ? 'הנחות מותגים' : 'הנחות בחיוב',
    });

    // Smooth scroll down to results
    setTimeout(() => {
      if (targetId) {
        const el = document.getElementById(`card-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 100);
  };

  const handleClearFilters = () => {
    setFilter(INITIAL_FILTER);
    setCrossRefNotification(null);
    setHighlightedId(null);
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filter.searchQuery.trim()) count++;
    if (filter.selectedCategory) count++;
    if (filter.onlyWithCrossReferences) count++;
    return count;
  }, [filter]);

  // Categories list per active tab
  const tabCategories = useMemo(() => {
    if (!rechargeableData || !scrapedData) return [];
    const set = new Set<string>();

    switch (activeTab) {
      case 'A':
        rechargeableData.brands.forEach((b) => set.add(b.category));
        break;
      case 'B':
        scrapedData.item_deals.forEach((d) => set.add(d.category));
        break;
      case 'C':
        scrapedData.brand_discounts.forEach((b) => set.add(b.category));
        break;
      case 'D':
        scrapedData.billing_stage_discounts.forEach((b) => set.add(b.category));
        break;
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'he'));
  }, [activeTab, rechargeableData, scrapedData]);

  // Filtered Tab A (Rechargeable)
  const filteredTabA = useMemo(() => {
    if (!rechargeableData) return [];
    return rechargeableData.brands.filter((brand: RechargeableBrand) => {
      // Category filter
      if (filter.selectedCategory && brand.category !== filter.selectedCategory) {
        return false;
      }
      // Cross ref filter
      if (filter.onlyWithCrossReferences && (!brand.cross_references || brand.cross_references.length === 0)) {
        return false;
      }
      // Search query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const inName = brand.name.toLowerCase().includes(q);
        const inSub = brand.brands.some((sub) => sub.toLowerCase().includes(q));
        const inCat = brand.category.toLowerCase().includes(q);
        const inRestrictions = brand.restrictions.some((r) => r.toLowerCase().includes(q));
        const inNotes = (brand.notes || '').toLowerCase().includes(q);
        const inBadges = brand.badges.some((b) => b.text.toLowerCase().includes(q));
        if (!inName && !inSub && !inCat && !inRestrictions && !inNotes && !inBadges) {
          return false;
        }
      }
      return true;
    });
  }, [rechargeableData, filter]);

  // Filtered Tab B (Item Deals)
  const filteredTabB = useMemo(() => {
    if (!scrapedData) return [];
    return scrapedData.item_deals.filter((deal: ScrapedItemDeal) => {
      if (filter.selectedCategory && deal.category !== filter.selectedCategory) {
        return false;
      }
      if (filter.onlyWithCrossReferences && (!deal.cross_references || deal.cross_references.length === 0)) {
        return false;
      }
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const inName = deal.name.toLowerCase().includes(q);
        const inCat = deal.category.toLowerCase().includes(q);
        const inTerms = (deal.terms || '').toLowerCase().includes(q);
        const inDisc = (deal.discount || '').toLowerCase().includes(q);
        const inBadges = deal.badges.some((b) => b.text.toLowerCase().includes(q));
        if (!inName && !inCat && !inTerms && !inDisc && !inBadges) {
          return false;
        }
      }
      return true;
    });
  }, [scrapedData, filter]);

  // Filtered Tab C (Brand Discounts)
  const filteredTabC = useMemo(() => {
    if (!scrapedData) return [];
    return scrapedData.brand_discounts.filter((brand: ScrapedBrandDiscount) => {
      if (filter.selectedCategory && brand.category !== filter.selectedCategory) {
        return false;
      }
      if (filter.onlyWithCrossReferences && (!brand.cross_references || brand.cross_references.length === 0)) {
        return false;
      }
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const inName = brand.name.toLowerCase().includes(q);
        const inCat = brand.category.toLowerCase().includes(q);
        const inTerms = (brand.terms || '').toLowerCase().includes(q);
        const inDisc = (brand.discount || '').toLowerCase().includes(q);
        const inBadges = brand.badges.some((b) => b.text.toLowerCase().includes(q));
        if (!inName && !inCat && !inTerms && !inDisc && !inBadges) {
          return false;
        }
      }
      return true;
    });
  }, [scrapedData, filter]);

  // Filtered Tab D (Billing-Stage Discounts)
  const filteredTabD = useMemo(() => {
    if (!scrapedData) return [];
    return scrapedData.billing_stage_discounts.filter((item: ScrapedBillingDiscount) => {
      if (filter.selectedCategory && item.category !== filter.selectedCategory) {
        return false;
      }
      if (filter.onlyWithCrossReferences && (!item.cross_references || item.cross_references.length === 0)) {
        return false;
      }
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        const inTerms = (item.terms || '').toLowerCase().includes(q);
        const inDisc = (item.discount || '').toLowerCase().includes(q);
        const inRate = (item.discount_rate || '').toLowerCase().includes(q);
        const inBadges = item.badges.some((b) => b.text.toLowerCase().includes(q));
        if (!inName && !inCat && !inTerms && !inDisc && !inRate && !inBadges) {
          return false;
        }
      }
      return true;
    });
  }, [scrapedData, filter]);

  const currentTabName = useMemo(() => {
    switch (activeTab) {
      case 'A':
        return 'כרטיס נטען 15%';
      case 'B':
        return 'הטבות מוצר';
      case 'C':
        return 'הנחות רשתות ומותגים';
      case 'D':
        return 'הנחות במעמד החיוב';
    }
  }, [activeTab]);

  const currentTabResultCount = useMemo(() => {
    switch (activeTab) {
      case 'A':
        return filteredTabA.length;
      case 'B':
        return filteredTabB.length;
      case 'C':
        return filteredTabC.length;
      case 'D':
        return filteredTabD.length;
    }
  }, [activeTab, filteredTabA, filteredTabB, filteredTabC, filteredTabD]);

  const counts = useMemo(() => {
    const a = rechargeableData ? rechargeableData.brands.length : 0;
    const b = scrapedData ? scrapedData.item_deals.length : 0;
    const c = scrapedData ? scrapedData.brand_discounts.length : 0;
    const d = scrapedData ? scrapedData.billing_stage_discounts.length : 0;
    return {
      tabA: a,
      tabB: b,
      tabC: c,
      tabD: d,
      total: a + b + c + d,
    };
  }, [rechargeableData, scrapedData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="p-4 bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center text-center max-w-sm">
          <Loader2 className="w-10 h-10 text-pink-600 animate-spin mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">טוען מאגר הטבות UNIQ...</h2>
          <p className="text-xs text-slate-500">
            מאמת ספח PDF כרטיס נטען 15% וטוען הטבות עדכניות מהאתר
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="p-6 bg-white rounded-3xl shadow-xl border border-red-200 flex flex-col items-center text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">{loadError}</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold hover:bg-pink-700 transition-colors"
          >
            רענן דף
          </button>
        </div>
      </div>
    );
  }

  const siteDate = scrapedData?.metadata.last_updated || scrapedData?.metadata.scraped_at;
  const isSiteDataStale = isDataStale(siteDate, 10);
  const siteDaysOld = getDaysDifference(siteDate);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setFilter({ ...filter, selectedCategory: '' });
        }}
        counts={counts}
        siteLastUpdated={siteDate}
        pdfLastUpdated={rechargeableData?.metadata.last_updated || rechargeableData?.metadata.last_verified}
        pdfHash={rechargeableData?.metadata.source_pdf_hash}
      />

      {/* Subtle Data Staleness Warning Banner (For scraped site data only > 10 days) */}
      {isSiteDataStale && showStaleBanner && (
        <aside
          data-testid="stale-site-data-banner"
          className="bg-amber-50/95 border-b border-amber-200/90 py-2 px-4 text-xs text-amber-950 transition-all shadow-2xs"
          role="alert"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>לתשומת לבך:</strong> נתוני אתר UNIQ (לשוניות ב&apos;, ג&apos; ו-ד&apos;) עודכנו לאחרונה לפני <strong>{siteDaysOld} ימים</strong> (מעל 10 ימים). ייתכן שחלק מהמבצעים או המחירים באתר הרשמי השתנו מאז. נתוני ספח כרטיס נטען 15% (לשונית א&apos;) מתעדכנים בנפרד.
              </span>
            </div>
            <button
              onClick={() => setShowStaleBanner(false)}
              className="p-1 rounded-lg hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors shrink-0 cursor-pointer"
              title="סגור הודעה"
              aria-label="סגור הודעת אזהרה"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Active Cross-Reference Notification Toast */}
        {crossRefNotification && (
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-3 text-xs md:text-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-pink-950 font-medium">
              <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
              <span>
                הגעת דרך הצלבה מ{crossRefNotification.fromTab} עבור:{' '}
                <strong className="text-pink-700 font-bold">&quot;{crossRefNotification.brandName}&quot;</strong>
              </span>
            </div>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors cursor-pointer text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>נקה סינון וחזור לכל הרשימה</span>
            </button>
          </div>
        )}

        {/* Global Rules Card on Tab A */}
        {activeTab === 'A' && rechargeableData && (
          <GlobalRulesCard
            rules={rechargeableData.global_rules}
            verifiedHash={rechargeableData.metadata.source_pdf_hash}
            verifiedDate={rechargeableData.metadata.last_verified}
            sourcePdfUrl={rechargeableData.metadata.source_pdf_url}
          />
        )}

        {/* Search & Filter Bar */}
        <SearchAndFilterBar
          filter={filter}
          onFilterChange={setFilter}
          categories={tabCategories}
          totalResults={currentTabResultCount}
          activeFilterCount={activeFilterCount}
          onClearFilters={handleClearFilters}
          currentTabName={currentTabName}
        />

        {/* Tab View Render */}
        <div className="mt-2">
          {activeTab === 'A' && (
            <TabAView
              brands={filteredTabA}
              onNavigateCrossReference={handleNavigateCrossReference}
              highlightedId={highlightedId}
              onOpenDetails={(item) => setModalItem({ item, type: 'rechargeable' })}
            />
          )}

          {activeTab === 'B' && (
            <TabBView
              deals={filteredTabB}
              onNavigateCrossReference={handleNavigateCrossReference}
              highlightedId={highlightedId}
              onOpenDetails={(item) => setModalItem({ item, type: 'deal' })}
            />
          )}

          {activeTab === 'C' && (
            <TabCView
              brands={filteredTabC}
              onNavigateCrossReference={handleNavigateCrossReference}
              highlightedId={highlightedId}
              onOpenDetails={(item) => setModalItem({ item, type: 'brand' })}
            />
          )}

          {activeTab === 'D' && (
            <TabDView
              discounts={filteredTabD}
              onNavigateCrossReference={handleNavigateCrossReference}
              highlightedId={highlightedId}
              onOpenDetails={(item) => setModalItem({ item, type: 'billing' })}
            />
          )}
        </div>
      </main>

      {/* Item Detail Modal */}
      <DetailModal
        isOpen={Boolean(modalItem)}
        onClose={() => setModalItem(null)}
        item={modalItem?.item}
        itemType={modalItem?.type || null}
        onNavigateCrossReference={handleNavigateCrossReference}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">UNIC Club Card Portal</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              מערכת סריקה שבועית מבוססת GitHub Actions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>כרטיסי Max Executive / TAU / UNIQ</span>
            <span>•</span>
            <a
              href="https://www.uniq-club.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 flex items-center gap-1 font-medium"
            >
              <span>אתר מועדון יוניק הרשמי</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
