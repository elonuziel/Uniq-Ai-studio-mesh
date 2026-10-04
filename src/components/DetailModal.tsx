import React from 'react';
import { TabKey } from '../types';
import { BadgePill } from './BadgePill';
import { CrossReferenceTag } from './CrossReferenceTag';
import { X, ShieldAlert, Sparkles, ExternalLink, Tag } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  itemType?: 'rechargeable' | 'deal' | 'brand' | 'billing' | null;
  onNavigateCrossReference: (targetTab: TabKey, filterBrandName: string, targetId?: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onNavigateCrossReference,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6 relative text-right"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Tag */}
        <div className="flex items-center gap-2 mb-2 pr-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            {item.category}
          </span>

          {item.discount && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
              {item.discount}
            </span>
          )}
        </div>

        {/* Item Title */}
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug">
          {item.name}
        </h2>

        {/* Sub brands list if rechargeable */}
        {item.brands && item.brands.length > 1 && (
          <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="block text-xs font-bold text-slate-700 mb-1.5">
              רשתות ומותגים כלולים בחבילה:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.brands.map((b: string, idx: number) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-xs text-slate-800 border border-slate-200 font-medium">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        {item.badges && item.badges.length > 0 && (
          <div className="mb-5">
            <span className="block text-xs font-semibold text-slate-500 mb-2">
              מגבלות, סייגים ודגשים:
            </span>
            <div className="flex flex-wrap gap-2">
              {item.badges.map((badge: any, idx: number) => (
                <BadgePill key={idx} badge={badge} size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Restrictions list */}
        {item.restrictions && item.restrictions.length > 0 && (
          <div className="mb-5 p-4 bg-red-50/60 rounded-2xl border border-red-100">
            <div className="flex items-center gap-2 text-xs font-bold text-red-900 mb-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>תנאי מימוש וסייגים רשמיים</span>
            </div>
            <ul className="space-y-1.5 text-xs text-red-950/90 pr-3 list-disc">
              {item.restrictions.map((r: string, idx: number) => (
                <li key={idx} className="leading-relaxed">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes / Terms */}
        {(item.notes || item.terms) && (
          <div className="mb-5 text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="block font-bold text-slate-900 mb-1">פרטים נוספים:</span>
            <p>{item.notes || item.terms}</p>
          </div>
        )}

        {/* Cross references inside modal */}
        {item.cross_references && item.cross_references.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-900 mb-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>הצלבות והטבות מקבילות עבור מותג זה</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.cross_references.map((ref: any, idx: number) => (
                <CrossReferenceTag
                  key={idx}
                  reference={ref}
                  onNavigate={(tab, name, id) => {
                    onClose();
                    onNavigateCrossReference(tab, name, id);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <a
            href="https://www.uniq-club.co.il"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors"
          >
            <span>פתח אתר מועדון UNIQ הרשמי</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
