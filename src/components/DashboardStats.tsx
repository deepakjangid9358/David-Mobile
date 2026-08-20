import React from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Smartphone,
  Radio,
  Headphones,
  DollarSign,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { StockItem, SaleTransaction } from '../types';
import { translations } from '../utils/translations';

interface DashboardStatsProps {
  items: StockItem[];
  sales: SaleTransaction[];
  lang: 'en' | 'hi';
  selectedCategory: 'all' | 'display' | 'keypad' | 'accessory';
  onSelectCategory: (category: 'all' | 'display' | 'keypad' | 'accessory') => void;
  onFilterLowStock: () => void;
  isLowStockFiltered: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  items,
  sales,
  lang,
  selectedCategory,
  onSelectCategory,
  onFilterLowStock,
  isLowStockFiltered,
}) => {
  const t = translations[lang];

  // Stock calculations
  const totalStockQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCostValue = items.reduce((sum, item) => sum + item.purchasePrice * item.quantity, 0);
  const totalRetailValue = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const lowStockItems = items.filter((item) => item.quantity <= item.minStockAlert);

  // Today's Sales Calculation
  const todayDateString = new Date().toDateString();
  const todaySales = sales.filter((s) => new Date(s.date).toDateString() === todayDateString);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayProfit = todaySales.reduce((sum, s) => {
    const saleProfit = s.items.reduce((pSum, item) => pSum + item.profit, 0);
    return sum + (saleProfit - (s.discount || 0));
  }, 0);

  // Due pending calculation
  const totalMarketDue = sales.reduce((sum, s) => sum + (s.dueAmount || 0), 0);

  return (
    <div className="space-y-4">
      {/* 4 Sleek Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Items */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'कुल स्टॉक मात्रा' : 'Total Items in Shop'}
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {totalStockQty.toLocaleString('en-IN')}{' '}
            <span className="text-xs text-slate-500 font-normal">({items.length} models)</span>
          </p>
          <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Retail value: ₹{totalRetailValue.toLocaleString('en-IN')}</span>
          </p>
        </div>

        {/* Card 2: Stock Purchase Value */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'स्टॉक लागत (Cost)' : 'Stock Value (Cost)'}
          </p>
          <p className="text-2xl font-bold text-slate-900">
            ₹{totalCostValue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {lang === 'hi' ? 'वर्तमान खरीद मूल्य' : 'Current wholesale valuation'}
          </p>
        </div>

        {/* Card 3: Today's Sales */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'आज की बिक्री' : 'Sales Today'}
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{todayRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <span>+{todaySales.length} {lang === 'hi' ? 'बिक्री' : 'Transactions'}</span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-500">Profit: ₹{todayProfit.toLocaleString('en-IN')}</span>
          </p>
        </div>

        {/* Card 4: Low Stock Alert / Market Due */}
        <div
          onClick={onFilterLowStock}
          className={`bg-white p-5 rounded-2xl shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            isLowStockFiltered
              ? 'border-rose-400 ring-2 ring-rose-300'
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {lang === 'hi' ? 'कम स्टॉक अलर्ट' : 'Low Stock Alert'}
            </p>
            {lowStockItems.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-rose-500" />
            )}
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {lowStockItems.length}{' '}
            <span className="text-xs text-slate-500 font-normal">items</span>
          </p>
          <p className="text-xs text-orange-500 mt-2 font-medium flex items-center justify-between">
            <span>{isLowStockFiltered ? 'Active Filter (Click to reset)' : 'Pending re-orders'}</span>
            {totalMarketDue > 0 && (
              <span className="text-rose-600 font-semibold">Due: ₹{totalMarketDue}</span>
            )}
          </p>
        </div>
      </div>

      {/* Sleek Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          id="cat-pill-all"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs ${
            selectedCategory === 'all' && !isLowStockFiltered
              ? 'bg-slate-900 text-white'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <span>{lang === 'hi' ? 'सभी सामान' : 'All Inventory'}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedCategory === 'all' && !isLowStockFiltered
                ? 'bg-slate-800 text-slate-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {items.length}
          </span>
        </button>

        <button
          id="cat-pill-display"
          onClick={() => onSelectCategory('display')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs ${
            selectedCategory === 'display' && !isLowStockFiltered
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>{lang === 'hi' ? 'मोबाइल डिस्प्ले (Folders)' : 'Mobile Displays'}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedCategory === 'display' && !isLowStockFiltered
                ? 'bg-blue-700 text-white'
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            {items.filter((i) => i.category === 'display').length}
          </span>
        </button>

        <button
          id="cat-pill-keypad"
          onClick={() => onSelectCategory('keypad')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs ${
            selectedCategory === 'keypad' && !isLowStockFiltered
              ? 'bg-indigo-600 text-white'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span>{lang === 'hi' ? 'कीपैड फोन' : 'Keypad Mobiles'}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedCategory === 'keypad' && !isLowStockFiltered
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            {items.filter((i) => i.category === 'keypad').length}
          </span>
        </button>

        <button
          id="cat-pill-accessory"
          onClick={() => onSelectCategory('accessory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-xs ${
            selectedCategory === 'accessory' && !isLowStockFiltered
              ? 'bg-emerald-600 text-white'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Headphones className="h-3.5 w-3.5" />
          <span>{lang === 'hi' ? 'मोबाइल एक्सेसरीज' : 'Accessories'}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedCategory === 'accessory' && !isLowStockFiltered
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {items.filter((i) => i.category === 'accessory').length}
          </span>
        </button>
      </div>
    </div>
  );
};
