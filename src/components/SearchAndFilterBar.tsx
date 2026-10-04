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
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filter,
  onFilterChange,
  categories,
  totalResults,
  activeFilterCount,
  onClearFilters,
  currentTabName,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
            placeholder={`חיפוש לפי שם מותג, רשת, מוצר, סוג הנחה או מגבלה ב${currentTabName}...`}
            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
            dir="rtl"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filter, searchQuery: '' })}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              title="נקה חיפוש"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[160px]">
            <select
              value={filter.selectedCategory}
              onChange={(e) => onFilterChange({ ...filter, selectedCategory: e.target.value })}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 cursor-pointer"
            >
              <option value="">כל הקטגוריות ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Layers className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>
            נמצאו <strong className="text-slate-800 font-semibold">{totalResults}</strong> תוצאות
          </span>
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

        <div className="text-[11px] text-slate-400">
          לחץ על תגית הצלבה כדי לקפוץ להטבה המקבילה בלשונית אחרת
        </div>
      </div>
    </div>
  );
};
