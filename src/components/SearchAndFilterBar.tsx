import React from 'react';
import { FilterState } from '../types';
import { Search, X, Filter, Sparkles, Layers } from 'lucide-react';

interface SearchAndFilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  categories: string[];
  totalResults: number;
  activeFilterCount: number;
  onClearFilters: () => void;
  currentTabName: string;
  tabBreakdown?: {
    tabA: number;
    tabB: number;
    tabC: number;
    tabD: number;
  };
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filter,
  onFilterChange,
  categories,
  totalResults,
  activeFilterCount,
  onClearFilters,
  currentTabName,
  tabBreakdown,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input & All-Tabs Toggle Container */}
        <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
              placeholder={
                filter.searchAllTabs
                  ? 'חיפוש בכל 4 הלשוניות (מותג, רשת, מוצר, סוג הנחה או מגבלה)...'
                  : `חיפוש לפי שם מותג, רשת, מוצר, סוג הנחה או מגבלה ב${currentTabName}...`
              }
              className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all text-slate-900 placeholder:text-slate-400 font-medium ${
                filter.searchAllTabs
                  ? 'border-pink-300 focus:ring-pink-500/20 focus:border-pink-500 bg-pink-50/20'
                  : 'border-slate-200 focus:ring-pink-500/20 focus:border-pink-500'
              }`}
              dir="rtl"
            />
            {filter.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="נקה חיפוש"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Option to Search Across All Tabs Toggle */}
          <button
            type="button"
            data-testid="search-all-tabs-toggle"
            onClick={() =>
              onFilterChange({
                ...filter,
                searchAllTabs: !filter.searchAllTabs,
              })
            }
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer shrink-0 ${
              filter.searchAllTabs
                ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-600/25 ring-2 ring-pink-400/30'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="חפש במקביל בכל 4 הלשוניות: כרטיס נטען, הטבות מוצר, רשתות והנחות במעמד החיוב"
          >
            <Layers className={`w-4 h-4 ${filter.searchAllTabs ? 'text-white' : 'text-pink-600'}`} />
            <span>חיפוש בכל הלשוניות</span>
            {filter.searchAllTabs ? (
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                פעיל
              </span>
            ) : (
              <span className="bg-slate-200/80 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                4 לשוניות
              </span>
            )}
          </button>
        </div>

        {/* Category Dropdown & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[160px]">
            <select
              value={filter.selectedCategory}
              onChange={(e) => onFilterChange({ ...filter, selectedCategory: e.target.value })}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 cursor-pointer"
            >
              <option value="">
                {filter.searchAllTabs ? `כל הקטגוריות (${categories.length})` : `כל הקטגוריות ב${currentTabName} (${categories.length})`}
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Quick Cross-Reference Filter Toggle */}
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                ...filter,
                onlyWithCrossReferences: !filter.onlyWithCrossReferences,
              })
            }
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              filter.onlyWithCrossReferences
                ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${filter.onlyWithCrossReferences ? 'text-white' : 'text-pink-500'}`} />
            <span>הצלבות בלבד</span>
          </button>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-3 py-2.5 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>נקה סינון ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>
            נמצאו <strong className="text-slate-800 font-semibold">{totalResults}</strong> תוצאות
            {filter.searchAllTabs ? ' בכל 4 הלשוניות' : ` ב${currentTabName}`}
          </span>

          {filter.searchAllTabs && (
            <span className="inline-flex items-center gap-1 text-pink-700 bg-pink-100/90 border border-pink-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
              <Layers className="w-3 h-3 text-pink-600" />
              חיפוש רוחבי בכל הלשוניות
            </span>
          )}

          {filter.searchQuery && (
            <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md font-medium">
              חיפוש: &quot;{filter.searchQuery}&quot;
            </span>
          )}
          {filter.selectedCategory && (
            <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md font-medium">
              קטגוריה: {filter.selectedCategory}
            </span>
          )}
          {filter.onlyWithCrossReferences && (
            <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md font-medium">
              הצלבות פעילות
            </span>
          )}
        </div>

        {filter.searchAllTabs && tabBreakdown && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span>פירוט:</span>
            <span className="text-pink-700">נטען: {tabBreakdown.tabA}</span>
            <span>•</span>
            <span className="text-emerald-700">מוצרים: {tabBreakdown.tabB}</span>
            <span>•</span>
            <span className="text-indigo-700">רשתות: {tabBreakdown.tabC}</span>
            <span>•</span>
            <span className="text-amber-700">חיוב: {tabBreakdown.tabD}</span>
          </div>
        )}

        {!filter.searchAllTabs && (
          <div className="text-[11px] text-slate-400">
            רוצה לחפש בכל הלשוניות במקביל? הפעל &quot;חיפוש בכל הלשוניות&quot;
          </div>
        )}
      </div>
    </div>
  );
};
