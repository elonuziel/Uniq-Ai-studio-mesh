import React, { useState } from 'react';
import { Globe, FileCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatHebrewDate, getDaysDifference, isDataStale } from '../utils/dateUtils';

interface StatusIndicatorsProps {
  siteLastUpdated?: string;
  pdfLastUpdated?: string;
  pdfHash?: string;
  totalScrapedItems?: number;
  totalPdfBrands?: number;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  siteLastUpdated,
  pdfLastUpdated,
  pdfHash,
  totalScrapedItems = 345,
  totalPdfBrands = 31,
}) => {
  const [showTooltip, setShowTooltip] = useState<'site' | 'pdf' | null>(null);

  const formattedSiteDate = formatHebrewDate(siteLastUpdated);
  const formattedPdfDate = formatHebrewDate(pdfLastUpdated);

  // Check staleness for scraped site data ONLY (> 10 days)
  const isSiteStale = isDataStale(siteLastUpdated, 10);
  const siteDaysOld = getDaysDifference(siteLastUpdated);

  return (
    <div
      className="flex flex-wrap items-center gap-2 text-xs"
      data-testid="status-indicators-container"
    >
      {/* Indicator 1: UNIQ Site Live Scraper */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip('site')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <div
          data-testid="site-status-indicator"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border shadow-2xs transition-all cursor-help ${
            isSiteStale
              ? 'bg-amber-50/95 border-amber-300 text-amber-950 hover:bg-amber-100/90 ring-1 ring-amber-400/50'
              : 'bg-emerald-50/90 border-emerald-200/90 text-emerald-900 hover:bg-emerald-100/90'
          }`}
          title={
            isSiteStale
              ? `אזהרה: נתוני אתר UNIQ לא עודכנו ${siteDaysOld} ימים (עודכן: ${formattedSiteDate})`
              : `אתר UNIQ עודכן: ${formattedSiteDate}`
          }
        >
          {/* Pulsing Dot - Amber if stale, Emerald if fresh */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSiteStale ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isSiteStale ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
          </span>

          {isSiteStale ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          ) : (
            <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          )}

          <span className="font-semibold text-[11px]">אתר UNIQ:</span>
          <span
            className={`text-[11px] font-bold dir-ltr ${
              isSiteStale ? 'text-amber-800' : 'text-emerald-700'
            }`}
          >
            {formattedSiteDate}
          </span>

          {isSiteStale && siteDaysOld !== null && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-200/80 text-amber-900 text-[10px] font-extrabold">
              {siteDaysOld} ימים
            </span>
          )}

          <Info
            className={`w-3 h-3 opacity-70 ${
              isSiteStale ? 'text-amber-600' : 'text-emerald-500'
            }`}
          />
        </div>

        {/* Hover Popover */}
        {showTooltip === 'site' && (
          <div
            className={`absolute right-0 top-full mt-1.5 z-50 w-72 p-3 bg-white rounded-2xl shadow-xl border text-slate-800 text-[11px] leading-relaxed animate-in fade-in zoom-in-95 ${
              isSiteStale ? 'border-amber-300' : 'border-emerald-200'
            }`}
          >
            {/* Warning Callout when stale */}
            {isSiteStale && (
              <div className="mb-2.5 p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-[10px] leading-snug flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-900 mb-0.5">אזהרת עדכניות נתונים</strong>
                  נתוני האתר עודכנו לאחרונה לפני <strong>{siteDaysOld} ימים</strong> (מעל 10 ימים). ייתכן שחלק מהמבצעים, המחירים או תנאי המימוש באתר הרשמי השתנו.
                </div>
              </div>
            )}

            <div
              className={`flex items-center gap-1.5 font-bold mb-1 border-b pb-1 ${
                isSiteStale
                  ? 'text-amber-900 border-amber-100'
                  : 'text-emerald-900 border-emerald-100'
              }`}
            >
              {isSiteStale ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>סקרייפר אתר UNIQ (GraphQL API)</span>
            </div>
            <p className="text-slate-600 mb-1">
              מוזן ישירות מ-GraphQL API של <strong>uniq-club.co.il</strong> עבור לשוניות ב&apos;, ג&apos; ו-ד&apos;.
            </p>
            <div className="space-y-0.5 text-slate-500 text-[10px] pt-1">
              <div>
                • <strong>עודכן לאחרונה:</strong> {formattedSiteDate}
              </div>
              <div>
                • <strong>סטטוס עדכניות:</strong>{' '}
                {isSiteStale ? (
                  <span className="text-amber-700 font-bold">לא מעודכן (לפני {siteDaysOld} ימים)</span>
                ) : (
                  <span className="text-emerald-700 font-bold">עדכני (פחות מ-10 ימים)</span>
                )}
              </div>
              <div>
                • <strong>הטבות מסונכרנות:</strong> {totalScrapedItems} פריטים
              </div>
              <div>
                • <strong>תדירות סריקה:</strong> שבועית אוטומטית (GitHub Actions)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicator 2: Max 15% PDF Dedicated Scraper */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip('pdf')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <div
          data-testid="pdf-status-indicator"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-pink-50/90 border border-pink-200/90 text-pink-900 shadow-2xs hover:bg-pink-100/90 transition-all cursor-help"
          title={`ספח Max אומת: ${formattedPdfDate}`}
        >
          {/* Pulsing Rose Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>

          <FileCheck className="w-3.5 h-3.5 text-pink-700 shrink-0" />
          <span className="font-semibold text-[11px] text-pink-950">ספח Max (15%):</span>
          <span className="text-[11px] font-bold text-pink-700 dir-ltr">{formattedPdfDate}</span>
          <Info className="w-3 h-3 text-pink-500 opacity-70" />
        </div>

        {/* Hover Popover */}
        {showTooltip === 'pdf' && (
          <div className="absolute right-0 top-full mt-1.5 z-50 w-64 p-3 bg-white rounded-2xl shadow-xl border border-pink-200 text-slate-800 text-[11px] leading-relaxed animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-1.5 font-bold text-pink-900 mb-1 border-b border-pink-100 pb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
              <span>סקרייפר ספח PDF של Max</span>
            </div>
            <p className="text-slate-600 mb-1">
              מאמת ומפרסר ישירות את מסמך ה-PDF הרשמי <strong>gc-ex-digital.pdf</strong> עבור לשונית א&apos;.
            </p>
            <div className="space-y-0.5 text-slate-500 text-[10px] pt-1">
              <div>• <strong>אומת:</strong> {formattedPdfDate}</div>
              <div>• <strong>רשתות פעילות:</strong> {totalPdfBrands} מותגים וקבוצות</div>
              {pdfHash && (
                <div className="truncate font-mono text-[9px] text-slate-400">
                  • <strong>SHA256:</strong> {pdfHash.slice(0, 16)}...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
