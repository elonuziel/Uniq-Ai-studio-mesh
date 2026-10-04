import React, { useState } from 'react';
import { GlobalRules } from '../types';
import { ShieldCheck, ChevronDown, ChevronUp, FileText, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';

interface GlobalRulesCardProps {
  rules: GlobalRules;
  verifiedHash?: string;
  verifiedDate?: string;
  sourcePdfUrl?: string;
}

export const GlobalRulesCard: React.FC<GlobalRulesCardProps> = ({
  rules,
  verifiedHash,
  verifiedDate,
  sourcePdfUrl,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-pink-900 via-pink-800 to-rose-900 text-white rounded-2xl p-5 md:p-6 shadow-xl mb-6 relative overflow-hidden border border-pink-700/50">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-700/40 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-pink-600/40 border border-pink-400/30 rounded-xl shadow-inner text-pink-200">
            <Sparkles className="w-6 h-6 text-pink-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {rules.title}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                מקור רשמי מאומת מול Max
              </span>
            </div>
            <p className="text-pink-100/90 text-sm">
              {rules.eligible_cards}
            </p>
          </div>
        </div>

        {sourcePdfUrl && (
          <a
            href={sourcePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-pink-100 border border-white/15 transition-colors self-start md:self-auto"
            title="פתח את מסמך ה-PDF הרשמי מחברת Max"
          >
            <FileText className="w-4 h-4 text-pink-300" />
            <span>ספח תנאי כרטיס רשמי (PDF)</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        )}
      </div>

      {/* Key Limits Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-5">
        {rules.limits_summary.map((item, idx) => (
          <div
            key={idx}
            className="bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-xs rounded-xl p-3 border border-pink-500/20 text-center"
          >
            <span className="block text-pink-200 text-xs font-medium mb-1 truncate">
              {item.label}
            </span>
            <span className="text-lg md:text-xl font-bold text-white tracking-tight">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Default Exclusion Warning Banner */}
      <div className="relative z-10 flex items-start gap-2.5 bg-amber-500/15 border border-amber-400/30 rounded-xl p-3 text-amber-100 text-xs md:text-sm">
        <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-200">כלל ברירת מחדל: </span>
          <span>{rules.default_exclusion}</span>
        </div>
      </div>

      {/* Expandable Fine Print */}
      <div className="relative z-10 mt-4 pt-3 border-t border-pink-700/30 flex items-center justify-between text-xs text-pink-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 font-medium hover:text-white transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'הסתר תקנון מלא ואימות קובץ' : 'הצג תקנון מפורט ואימות קובץ'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {verifiedDate && (
          <span className="text-pink-300/80 text-[11px]">
            עודכן: {new Date(verifiedDate).toLocaleDateString('he-IL')}
          </span>
        )}
      </div>

      {isExpanded && (
        <div className="relative z-10 mt-3 pt-3 border-t border-pink-700/20 text-xs text-pink-100/90 space-y-2 leading-relaxed bg-black/15 p-4 rounded-xl">
          <p>
            <strong>תוקף ופדיון: </strong>
            {rules.validity}
          </p>
          <p>
            <strong>שימוש בדיגיטל ובאפליקציה: </strong>
            במקום להסתובב עם כרטיס פיזי, ניתן להמיר בקלות לגיפט קארד דיגיטלי דרך אפליקציית Max. שימו לב: בהמרת הכרטיס מכרטיס פיזי לדיגיטלי ייתכנו שינויים ברשימת הרשתות המכבדות.
          </p>
          {verifiedHash && (
            <div className="text-[11px] font-mono text-pink-300/70 pt-2 border-t border-pink-700/20">
              SHA256 של קובץ המקור: {verifiedHash}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
