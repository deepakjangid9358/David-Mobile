import React, { useState } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  MapPin,
  AlertTriangle,
  ArrowUpDown,
  Smartphone,
  Radio,
  Headphones,
  Wrench,
  FileSpreadsheet,
  X,
  Filter,
} from 'lucide-react';
import { StockItem } from '../types';
import { translations } from '../utils/translations';
import { DISPLAY_QUALITIES } from '../utils/storage';
import { exportStockToExcel } from '../utils/exportExcel';

interface ItemManagerProps {
  items: StockItem[];
  lang: 'en' | 'hi';
  selectedCategory: 'all' | 'display' | 'keypad' | 'accessory';
  isLowStockFiltered: boolean;
  onEditItem: (item: StockItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateStock: (id: string, delta: number) => void;
  onQuickSell: (item: StockItem) => void;
  onAddNewItem: () => void;
  // Global search from header
  globalSearchQuery?: string;
  onClearGlobalSearch?: () => void;
}

export const ItemManager: React.FC<ItemManagerProps> = ({
  items,
  lang,
  selectedCategory,
  isLowStockFiltered,
  onEditItem,
  onDeleteItem,
  onUpdateStock,
  onQuickSell,
  onAddNewItem,
  globalSearchQuery = '',
  onClearGlobalSearch,
}) => {
  const t = translations[lang];
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'profit'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [hideCostPrice, setHideCostPrice] = useState<boolean>(false);

  // Active search query combining global header or local input
  const activeSearch = globalSearchQuery.trim() || localSearchTerm.trim();

  // Extract unique brands for filter
  const uniqueBrands = Array.from(new Set(items.map((i) => i.brand))).filter(Boolean);

  // Filter items
  const filteredItems = items.filter((item) => {
    // If global search is actively typed, let the user search across all categories unless they specifically restricted
    if (!globalSearchQuery.trim() && selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (isLowStockFiltered && item.quantity > item.minStockAlert) return false;
    if (selectedBrand !== 'all' && item.brand !== selectedBrand) return false;
    if (selectedQuality !== 'all' && item.qualityGrade !== selectedQuality) return false;

    if (activeSearch !== '') {
      const q = activeSearch.toLowerCase();
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchModel = item.modelName.toLowerCase().includes(q);
      const matchQuality = item.qualityGrade?.toLowerCase().includes(q) || false;
      const matchSubCat = item.subCategory?.toLowerCase().includes(q) || false;
      const matchRack = item.locationRack?.toLowerCase().includes(q) || false;
      const matchNotes = item.notes?.toLowerCase().includes(q) || false;
      const matchColor = item.color?.toLowerCase().includes(q) || false;
      const matchBarcode = item.barcode?.toLowerCase().includes(q) || false;

      if (!matchBrand && !matchModel && !matchQuality && !matchSubCat && !matchRack && !matchNotes && !matchColor && !matchBarcode) {
        return false;
      }
    }

    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'name') {
      comp = a.modelName.localeCompare(b.modelName);
    } else if (sortBy === 'stock') {
      comp = a.quantity - b.quantity;
    } else if (sortBy === 'price') {
      comp = a.sellingPrice - b.sellingPrice;
    } else if (sortBy === 'profit') {
      const profitA = a.sellingPrice - a.purchasePrice;
      const profitB = b.sellingPrice - b.purchasePrice;
      comp = profitA - profitB;
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  const getCategoryBadge = (item: StockItem) => {
    if (item.category === 'display') {
      return (
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-md text-[11px] font-bold">
          Display
        </span>
      );
    }
    if (item.category === 'keypad') {
      return (
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md text-[11px] font-bold">
          Keypad
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md text-[11px] font-bold">
        Accessory
      </span>
    );
  };

  const getQualityBadge = (quality?: string) => {
    if (!quality) return null;
    const match = DISPLAY_QUALITIES.find((q) => q.label.toLowerCase() === quality.toLowerCase());
    const badgeColor = match ? match.badgeColor : 'bg-slate-100 text-slate-700 border-slate-200';
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
        {quality}
      </span>
    );
  };

  const handleExportThisView = () => {
    exportStockToExcel(filteredItems, 'Current_Stock_View');
  };

  const handleClearAllFilters = () => {
    setLocalSearchTerm('');
    if (onClearGlobalSearch) onClearGlobalSearch();
    setSelectedBrand('all');
    setSelectedQuality('all');
  };

  const hasActiveFilters = Boolean(
    activeSearch || selectedBrand !== 'all' || selectedQuality !== 'all' || isLowStockFiltered
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col space-y-0">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-4">
        {/* Active Search / Filter Banner if global search is on */}
        {activeSearch && (
          <div className="bg-blue-50/80 border border-blue-200 text-blue-900 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                {lang === 'hi' ? 'खोज परिणाम:' : 'Search results for:'}{' '}
                <strong className="font-semibold">&ldquo;{activeSearch}&rdquo;</strong> &bull;{' '}
                <span className="text-blue-700 font-bold">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
                </span>
                {globalSearchQuery && (
                  <span className="text-[11px] text-blue-600 ml-1">(across all stock categories)</span>
                )}
              </span>
            </div>
            <button
              onClick={handleClearAllFilters}
              className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 hover:underline ml-2"
            >
              <X className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'हटाएं' : 'Clear'}</span>
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search and Brand/Quality Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Inline Search Bar */}
            <div className="relative min-w-[200px] sm:min-w-[240px] flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={
                  lang === 'hi'
                    ? 'मॉडल, ब्रांड, क्वालिटी या रैक खोजें...'
                    : 'Filter model, brand, grade, rack...'
                }
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
              {localSearchTerm && (
                <button
                  type="button"
                  onClick={() => setLocalSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            >
              <option value="all">All Brands ({items.length})</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Quality Grade Filter (for displays) */}
            {selectedCategory === 'display' || selectedCategory === 'all' ? (
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="all">All Grades / Qualities</option>
                {DISPLAY_QUALITIES.map((q) => (
                  <option key={q.label} value={q.label}>
                    {q.label} Grade
                  </option>
                ))}
              </select>
            ) : null}

            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1 rounded hover:bg-slate-100 transition font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Right Action Tools: Hide Cost, Excel Export, Add Item */}
          <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
            {/* Cost Shield Privacy Toggle */}
            <button
              onClick={() => setHideCostPrice(!hideCostPrice)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                hideCostPrice
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle purchase cost display for customer privacy"
            >
              {hideCostPrice ? <EyeOff className="h-3.5 w-3.5 text-amber-600" /> : <Eye className="h-3.5 w-3.5 text-slate-500" />}
              <span>{hideCostPrice ? 'Cost Hidden' : 'Show Cost'}</span>
            </button>

            {/* Export To Excel Button */}
            <button
              id="btn-table-export-excel"
              onClick={handleExportThisView}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition shadow-2xs"
              title="Download this stock list as Excel spreadsheet (.csv)"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'एक्सेल डाउनलोड' : 'Export Excel'}</span>
            </button>

            {/* Quick Add Button */}
            <button
              onClick={onAddNewItem}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? '+ नया मॉडल' : '+ Add Model'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <th className="py-3.5 px-4 font-semibold">
                <button
                  onClick={() => {
                    if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  <span>Model / Item Description</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-4 font-semibold">Category & Grade</th>
              <th className="py-3.5 px-4 font-semibold">Rack / Location</th>
              {!hideCostPrice && <th className="py-3.5 px-4 font-semibold text-right">Cost (खरीद)</th>}
              <th className="py-3.5 px-4 font-semibold text-right">
                <button
                  onClick={() => {
                    if (sortBy === 'price') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('price');
                      setSortOrder('asc');
                    }
                  }}
                  className="flex items-center gap-1 hover:text-slate-900 ml-auto"
                >
                  <span>Sale Rate (बिक्री)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">
                <button
                  onClick={() => {
                    if (sortBy === 'stock') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else {
                      setSortBy('stock');
                      setSortOrder('asc');
                    }
                  }}
                  className="flex items-center gap-1 hover:text-slate-900 ml-auto"
                >
                  <span>In Stock</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-4 font-semibold text-center">Quick Adjust</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400 text-xs">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-bold text-slate-700 text-sm">
                      {lang === 'hi' ? 'कोई मॉडल या सामान नहीं मिला' : 'No items match your search'}
                    </p>
                    <p className="text-slate-400">
                      {lang === 'hi'
                        ? 'खोज शब्द बदलें या नया मॉडल जोड़ने के लिए "+ Add Model" पर क्लिक करें।'
                        : 'Try adjusting your search keywords or add a new model.'}
                    </p>
                    <button
                      onClick={handleClearAllFilters}
                      className="mt-2 text-xs font-bold text-blue-600 hover:underline inline-block"
                    >
                      Clear Search & Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => {
                const isLow = item.quantity <= item.minStockAlert;
                const isOut = item.quantity === 0;
                const totalCustomerPrice =
                  item.sellingPrice + (item.category === 'display' ? item.fittingCharge || 0 : 0);
                const profitMargin = totalCustomerPrice - item.purchasePrice;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isOut ? 'bg-rose-50/30' : isLow ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Item Name & Details */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{item.modelName}</span>
                          {item.color && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({item.color})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          <span className="text-blue-600 font-bold">{item.brand}</span>
                          {item.notes && <span className="text-slate-400"> &bull; {item.notes}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Category & Grade */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {getCategoryBadge(item)}
                        {item.qualityGrade && getQualityBadge(item.qualityGrade)}
                        {item.subCategory && (
                          <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                            {item.subCategory}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Drawer / Location */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-600 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{item.locationRack || <span className="text-slate-300">—</span>}</span>
                      </div>
                    </td>

                    {/* Purchase Cost */}
                    {!hideCostPrice && (
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-600">
                        ₹{item.purchasePrice}
                      </td>
                    )}

                    {/* Selling Rate & Profit */}
                    <td className="py-3 px-4 text-right font-mono">
                      <div className="font-bold text-slate-900 text-sm">₹{item.sellingPrice}</div>
                      {item.category === 'display' && item.fittingCharge ? (
                        <div className="text-[10px] text-cyan-700">
                          +₹{item.fittingCharge} fit (₹{totalCustomerPrice})
                        </div>
                      ) : null}
                      {!hideCostPrice && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          +₹{profitMargin} margin
                        </div>
                      )}
                    </td>

                    {/* Stock Count & Status */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border ${
                            isOut
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.quantity} {item.quantity === 1 ? 'pc' : 'pcs'}
                        </span>
                        {isLow && (
                          <AlertTriangle
                            className="h-4 w-4 text-amber-500 shrink-0"
                            title={`Low stock alert (Alert threshold: ${item.minStockAlert})`}
                          />
                        )}
                      </div>
                    </td>

                    {/* Quick Stock Adjust Buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onUpdateStock(item.id, -1)}
                          disabled={item.quantity <= 0}
                          className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 flex items-center justify-center transition"
                          title="Decrease Stock (-1)"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, 1)}
                          className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                          title="Increase Stock (+1)"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Actions: Edit, Delete, Fast Sell */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* 1-Click Bill Button */}
                        <button
                          onClick={() => onQuickSell(item)}
                          disabled={item.quantity <= 0}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 disabled:opacity-30 transition shadow-2xs"
                          title="Generate bill for this item"
                        >
                          <ShoppingCart className="h-3 w-3 text-emerald-400" />
                          <span>Bill</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Model / Rates"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${item.brand} ${item.modelName}?`
                              )
                            ) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          Showing <strong>{sortedItems.length}</strong> of <strong>{items.length}</strong> total stock models
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Total Units in this view:</span>
          <strong className="font-mono text-slate-800 font-bold">
            {filteredItems.reduce((acc, it) => acc + it.quantity, 0)} pcs
          </strong>
        </div>
      </div>
    </div>
  );
};
