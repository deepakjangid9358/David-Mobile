import React, { useRef, useEffect } from 'react';
import {
  Plus,
  ShoppingCart,
  Calculator,
  Store,
  Languages,
  Menu,
  Search,
  X,
  FileSpreadsheet,
  Cloud,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { ShopProfile } from '../types';
import { translations } from '../utils/translations';

interface HeaderProps {
  shopProfile: ShopProfile;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  onOpenNewItem: () => void;
  onOpenNewSale: () => void;
  onOpenQuoter: () => void;
  onOpenSettings: () => void;
  onOpenGDriveBackup: () => void;
  onToggleSidebar?: () => void;
  title?: string;
  subtitle?: string;
  // Global Search props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  totalMatchingItems?: number;
  // Excel Export
  onExportExcel: () => void;
  // Live auto-backup status
  autoSyncStatus?: { status: 'idle' | 'syncing' | 'synced' | 'error'; message?: string };
}

export const Header: React.FC<HeaderProps> = ({
  shopProfile,
  lang,
  onToggleLang,
  onOpenNewItem,
  onOpenNewSale,
  onOpenQuoter,
  onOpenSettings,
  onOpenGDriveBackup,
  onToggleSidebar,
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalMatchingItems,
  onExportExcel,
  autoSyncStatus,
}) => {
  const t = translations[lang];
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) &&
        document.activeElement !== searchInputRef.current
      ) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement?.tagName || '') === -1) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="min-h-16 lg:h-20 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between px-3 sm:px-6 lg:px-8 py-2 md:py-0 shadow-xs shrink-0 z-20 gap-2 md:gap-4">
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center justify-between md:justify-start gap-3">
        <div className="flex items-center gap-2.5">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span>{title || t.appTitle}</span>
            </h2>
            <p className="text-[11px] text-slate-400 hidden xl:block">
              {subtitle || `${lang === 'hi' ? 'दुकान' : 'Store'}: ${shopProfile.shopName}`}
            </p>
          </div>
        </div>

        {/* Mobile-only quick actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            onClick={onOpenGDriveBackup}
            className="p-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold"
            title="Google Drive Cloud Backup"
          >
            <Cloud className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={onExportExcel}
            className="p-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold"
            title="Excel Export"
          >
            <FileSpreadsheet className="h-4 w-4" />
          </button>
          <button
            onClick={onOpenNewItem}
            className="p-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            title="Add Item"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Center: Global Search Bar Across All Categories */}
      <div className="flex-1 max-w-xl mx-0 md:mx-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>

          <input
            id="global-header-search-input"
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'सभी डिस्प्ले, मॉडल, कीपैड, एक्सेसरीज खोजें... (जैसे V30, G85, Note 13)'
                : 'Search all items by model, brand, grade, rack... (e.g. V30, G85, Note 13)'
            }
            className="w-full pl-9 pr-20 py-2 sm:py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 shadow-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />

          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={onClearSearch}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                title="Clear Search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                /
              </kbd>
            )}

            {searchQuery && totalMatchingItems !== undefined && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                {totalMatchingItems} {totalMatchingItems === 1 ? 'match' : 'matches'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls and Primary Action Buttons */}
      <div className="hidden md:flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Google Drive Cloud Backup Button with Live Sync State */}
        <button
          id="header-btn-gdrive-backup"
          onClick={onOpenGDriveBackup}
          className={`flex items-center gap-1.5 font-bold px-3 py-2 rounded-xl text-xs transition border shadow-2xs active:scale-95 ${
            autoSyncStatus?.status === 'syncing'
              ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
              : autoSyncStatus?.status === 'synced'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
          }`}
          title={
            autoSyncStatus?.message ||
            (lang === 'hi'
              ? 'गूगल ड्राइव क्लाउड बैकअप'
              : 'Google Drive Cloud Backup & Auto-Sync')
          }
        >
          {autoSyncStatus?.status === 'syncing' ? (
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          ) : autoSyncStatus?.status === 'synced' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <Cloud className="h-4 w-4 text-blue-600" />
          )}
          <span className="hidden lg:inline">
            {autoSyncStatus?.status === 'syncing'
              ? lang === 'hi'
                ? 'सिंक हो रहा है...'
                : 'Syncing...'
              : autoSyncStatus?.status === 'synced'
              ? lang === 'hi'
                ? 'ड्राइव सिंक'
                : 'Drive Synced'
              : lang === 'hi'
              ? 'ड्राइव बैकअप'
              : 'Drive Backup'}
          </span>
        </button>

        {/* Excel Export Button */}
        <button
          id="header-btn-excel-export"
          onClick={onExportExcel}
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-2 rounded-xl text-xs transition border border-emerald-200 shadow-2xs active:scale-95"
          title={lang === 'hi' ? 'पूरा स्टॉक एक्सेल में डाउनलोड करें' : 'Export Full Stock to Excel (CSV)'}
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          <span className="hidden lg:inline">{lang === 'hi' ? 'एक्सेल' : 'Excel'}</span>
        </button>

        {/* Quick Rate Quoter Tool */}
        <button
          id="header-btn-quoter"
          onClick={onOpenQuoter}
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition border border-slate-200 shadow-2xs"
          title="Quick Rate Check for Counter"
        >
          <Calculator className="h-4 w-4 text-blue-600" />
          <span className="hidden xl:inline">{lang === 'hi' ? 'रेट चेकर' : 'Quoter'}</span>
        </button>

        {/* Language Switcher */}
        <button
          id="header-btn-lang"
          onClick={onToggleLang}
          className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-2 rounded-xl text-xs font-semibold transition border border-slate-200 shadow-2xs"
          title="Switch Language / भाषा बदलें"
        >
          <Languages className="h-4 w-4 text-slate-500" />
          <span className="text-blue-600 font-bold">{lang === 'hi' ? 'ENG' : 'हिंदी'}</span>
        </button>

        {/* Shop Settings */}
        <button
          id="header-btn-settings"
          onClick={onOpenSettings}
          className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 p-2 rounded-xl text-xs transition border border-slate-200 shadow-2xs"
          title="Shop Details & Settings"
        >
          <Store className="h-4 w-4" />
        </button>

        {/* + Add New Item */}
        <button
          id="header-btn-add-item"
          onClick={onOpenNewItem}
          className="bg-blue-600 text-white px-3.5 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold hover:bg-blue-700 shadow-xs hover:shadow transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>{lang === 'hi' ? '+ नया सामान' : '+ New Item'}</span>
        </button>

        {/* + New Sale Bill */}
        <button
          id="header-btn-new-sale"
          onClick={onOpenNewSale}
          className="bg-slate-900 text-white px-3.5 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold hover:bg-slate-800 shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ShoppingCart className="h-4 w-4 text-emerald-400" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'नया बिल' : 'New Sale'}</span>
        </button>
      </div>
    </header>
  );
};
