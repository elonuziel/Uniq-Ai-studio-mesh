import React from 'react';
import { TabKey } from '../types';
import { StatusIndicators } from './StatusIndicators';
import { CreditCard, ShoppingBag, Store, Zap, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  counts: {
    tabA: number;
    tabB: number;
    tabC: number;
    tabD: number;
    total: number;
  };
  siteLastUpdated?: string;
  pdfLastUpdated?: string;
  pdfHash?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  counts,
  siteLastUpdated,
  pdfLastUpdated,
  pdfHash,
}) => {
  const tabs: { key: TabKey; label: string; count: number; icon: React.FC<any>; color: string }[] = [
    {
      key: 'A',
      label: 'כרטיס נטען 15% הנחה',
      count: counts.tabA,
      icon: CreditCard,
      color: 'pink',
    },
    {
      key: 'B',
      label: 'הטבות לפי מוצר',
      count: counts.tabB,
      icon: ShoppingBag,
      color: 'emerald',
    },
    {
      key: 'C',
      label: 'הנחות רשתות ומותגים',
      count: counts.tabC,
      icon: Store,
      color: 'indigo',
    },
    {
      key: 'D',
      label: 'הנחות במעמד החיוב',
      count: counts.tabD,
      icon: Zap,
      color: 'amber',
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Status & Timestamp Ribbon */}
        <div className="pt-2.5 pb-1.5 flex flex-wrap items-center justify-between border-b border-slate-100 gap-2">
          {/* Top-Right Corner: Dedicated Scraper Status Indicators */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
              סטטוס סנכרון:
            </span>
            <StatusIndicators
              siteLastUpdated={siteLastUpdated}
              pdfLastUpdated={pdfLastUpdated}
              pdfHash={pdfHash}
              totalScrapedItems={counts.tabB + counts.tabC + counts.tabD}
              totalPdfBrands={counts.tabA}
            />
          </div>

          {/* Top-Left / Summary counter */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px]">
                סה&quot;כ <strong className="text-slate-900 font-bold">{counts.total}</strong> הטבות פעילות
              </span>
            </div>
          </div>
        </div>

        {/* Branding & Subtitle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                  מועדון UNIQ <span className="text-pink-600">הטבות וכרטיס נטען</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                  <Shield className="w-3 h-3 text-pink-600" />
                  נתונים אמיתיים ומאומתים
                </span>
              </div>
              <p className="text-xs text-slate-500">
                אגרגטור, מנוע הצלבה וסינון הנחות עבור מחזיקי כרטיס אשראי יוניק (Max / TAU)
              </p>
            </div>
          </div>
        </div>

        {/* 4 Tabs Selector Bar */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-2 px-3.5 md:px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
