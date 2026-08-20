import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Radio,
  Headphones,
  FileSpreadsheet,
  Users,
  Calculator,
  AlertTriangle,
  X,
  Store,
  Cloud,
} from 'lucide-react';
import { ShopProfile, ItemCategory } from '../types';
import { translations } from '../utils/translations';

interface SidebarProps {
  shopProfile: ShopProfile;
  lang: 'en' | 'hi';
  activeView: 'inventory' | 'sales' | 'khata' | 'quoter';
  setActiveView: (view: 'inventory' | 'sales' | 'khata' | 'quoter') => void;
  selectedCategory: 'all' | 'display' | 'keypad' | 'accessory';
  onSelectCategory: (cat: 'all' | 'display' | 'keypad' | 'accessory') => void;
  lowStockCount: number;
  onFilterLowStock: () => void;
  isLowStockFiltered: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenQuoter: () => void;
  onOpenGDriveBackup?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  shopProfile,
  lang,
  activeView,
  setActiveView,
  selectedCategory,
  onSelectCategory,
  lowStockCount,
  onFilterLowStock,
  isLowStockFiltered,
  isOpenMobile,
  onCloseMobile,
  onOpenQuoter,
  onOpenGDriveBackup,
}) => {
  const t = translations[lang];

  const handleNavClick = (view: 'inventory' | 'sales' | 'khata', cat?: 'all' | 'display' | 'keypad' | 'accessory') => {
    setActiveView(view);
    if (cat) {
      onSelectCategory(cat);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col text-slate-300 border-r border-slate-800 shrink-0 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 mb-2 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm">
              DM
            </span>
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-white tracking-tight leading-tight line-clamp-1">
                {shopProfile.shopName || 'David Mobile'}
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Stock & Cloud Backup
              </p>
            </div>
          </div>

          {/* Close for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 py-3 overflow-y-auto">
          {/* Dashboard / All Stock */}
          <button
            id="sidebar-nav-all"
            onClick={() => handleNavClick('inventory', 'all')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeView === 'inventory' && selectedCategory === 'all' && !isLowStockFiltered
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>{lang === 'hi' ? 'सभी सामान (All Stock)' : 'All Inventory'}</span>
          </button>

          {/* 1. Mobile Displays */}
          <button
            id="sidebar-nav-display"
            onClick={() => handleNavClick('inventory', 'display')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeView === 'inventory' && selectedCategory === 'display' && !isLowStockFiltered
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smartphone className="h-4 w-4 text-blue-400 shrink-0" />
            <span>{lang === 'hi' ? 'मोबाइल डिस्प्ले (Folder)' : 'Display Folders'}</span>
          </button>

          {/* 2. Keypad Mobiles */}
          <button
            id="sidebar-nav-keypad"
            onClick={() => handleNavClick('inventory', 'keypad')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeView === 'inventory' && selectedCategory === 'keypad' && !isLowStockFiltered
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Radio className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>{lang === 'hi' ? 'कीपैड मोबाइल' : 'Keypad Phones'}</span>
          </button>

          {/* 3. Mobile Accessories */}
          <button
            id="sidebar-nav-accessory"
            onClick={() => handleNavClick('inventory', 'accessory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeView === 'inventory' && selectedCategory === 'accessory' && !isLowStockFiltered
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Headphones className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{lang === 'hi' ? 'मोबाइल एक्सेसरीज' : 'Accessories'}</span>
          </button>

          <div className="pt-3 pb-1">
            <div className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {lang === 'hi' ? 'बिक्री और हिसाब' : 'Sales & Cloud'}
            </div>
          </div>

          {/* Sales History & Billing */}
          <button
            id="sidebar-nav-sales"
            onClick={() => handleNavClick('sales')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeView === 'sales'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>{lang === 'hi' ? 'बिक्री रजिस्टर (Bills)' : 'Sales & Invoices'}</span>
          </button>

          {/* Customer Khata */}
          <button
            id="sidebar-nav-khata"
            onClick={() => handleNavClick('khata')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
              activeView === 'khata'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{lang === 'hi' ? 'ग्राहक खाता (Due Khata)' : 'Customer Dues'}</span>
          </button>

          {/* Rate Quoter */}
          <button
            id="sidebar-nav-quoter"
            onClick={() => {
              onOpenQuoter();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-left"
          >
            <Calculator className="h-4 w-4 text-teal-400 shrink-0" />
            <span>{lang === 'hi' ? 'काउंटर रेट चेकर' : 'Quick Rate Check'}</span>
          </button>

          {/* Google Drive Cloud Backup */}
          {onOpenGDriveBackup && (
            <button
              id="sidebar-nav-gdrive"
              onClick={() => {
                onOpenGDriveBackup();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-blue-300 bg-blue-950/40 hover:bg-blue-900/50 hover:text-white border border-blue-800/40 transition-all text-left"
            >
              <Cloud className="h-4 w-4 text-blue-400 shrink-0" />
              <span>{lang === 'hi' ? 'गूगल ड्राइव बैकअप' : 'Google Drive Backup'}</span>
            </button>
          )}
        </nav>

        {/* Low Stock Alert Box at Bottom */}
        <div className="p-5 mt-auto border-t border-slate-800">
          <button
            onClick={() => {
              onFilterLowStock();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full text-left rounded-xl p-4 transition-all border ${
              isLowStockFiltered
                ? 'bg-rose-950/70 border-rose-600 ring-2 ring-rose-500/40 text-white'
                : 'bg-slate-800 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold flex items-center justify-between">
              <span>{lang === 'hi' ? 'कम स्टॉक अलर्ट' : 'Low Stock Alert'}</span>
              {lowStockCount > 0 && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />}
            </p>
            <p className={`text-sm font-bold ${lowStockCount > 0 ? 'text-blue-400' : 'text-slate-400'}`}>
              {lowStockCount} {lang === 'hi' ? 'आइटम मंगाना जरूरी' : 'items need restock'}
            </p>
          </button>
        </div>
      </aside>
    </>
  );
};
