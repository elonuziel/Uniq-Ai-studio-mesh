import React, { useState } from 'react';
import { Globe, FileCheck, Info, CheckCircle2 } from 'lucide-react';

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

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'לא זמין';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formattedSiteDate = formatDate(siteLastUpdated);
  const formattedPdfDate = formatDate(pdfLastUpdated);

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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-emerald-900 shadow-2xs hover:bg-emerald-100/90 transition-all cursor-help"
          title={`אתר UNIQ עודכן: ${formattedSiteDate}`}
        >
          {/* Pulsing Green Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="font-semibold text-[11px] text-emerald-950">אתר UNIQ:</span>
          <span className="text-[11px] font-bold text-emerald-700 dir-ltr">{formattedSiteDate}</span>
          <Info className="w-3 h-3 text-emerald-500 opacity-70" />
        </div>

        {/* Hover Popover */}
        {showTooltip === 'site' && (
          <div className="absolute right-0 top-full mt-1.5 z-50 w-64 p-3 bg-white rounded-2xl shadow-xl border border-emerald-200 text-slate-800 text-[11px] leading-relaxed animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1 border-b border-emerald-100 pb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>סקרייפר אתר UNIQ (חי)</span>
            </div>
            <p className="text-slate-600 mb-1">
              מוזן ישירות מ-GraphQL API של <strong>uniq-club.co.il</strong> עבור לשוניות ב&apos;, ג&apos; ו-ד&apos;.
            </p>
            <div className="space-y-0.5 text-slate-500 text-[10px] pt-1">
              <div>• <strong>עודכן:</strong> {formattedSiteDate}</div>
              <div>• <strong>הטבות מסונכרנות:</strong> {totalScrapedItems} פריטים</div>
              <div>• <strong>תדירות סריקה:</strong> שבועית אוטומטית (GitHub Actions)</div>
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
