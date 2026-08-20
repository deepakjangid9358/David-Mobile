import React, { useState } from 'react';
import {
  X,
  Search,
  Eye,
  EyeOff,
  Calculator,
  Smartphone,
  Radio,
  Headphones,
  CheckCircle,
  Tag,
  Wrench,
  ShoppingCart,
  MapPin,
} from 'lucide-react';
import { StockItem } from '../types';
import { translations } from '../utils/translations';

interface QuickPriceLookupProps {
  isOpen: boolean;
  onClose: () => void;
  items: StockItem[];
  lang: 'en' | 'hi';
  onSelectForSale?: (item: StockItem) => void;
}

export const QuickPriceLookup: React.FC<QuickPriceLookupProps> = ({
  isOpen,
  onClose,
  items,
  lang,
  onSelectForSale,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [hideCostPrice, setHideCostPrice] = useState<boolean>(true); // Default hidden for customer facing privacy

  if (!isOpen) return null;

  const brands = Array.from(new Set(items.map((i) => i.brand)));

  const filteredItems = items.filter((item) => {
    if (selectedBrand !== 'all' && item.brand !== selectedBrand) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.modelName.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.qualityGrade?.toLowerCase().includes(q) ||
      item.subCategory?.toLowerCase().includes(q) ||
      item.locationRack?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {lang === 'hi' ? 'काउंटर रेट चेकर (Quick Rate Quoter)' : 'Counter Quick Rate Quoter'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'ग्राहक को रेट बताने के लिए तुरंत मॉडल खोजें (खरीद रेट छुपाने का विकल्प उपलब्ध)'
                  : 'Fast rate check for walk-in customers with privacy shield'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHideCostPrice(!hideCostPrice)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                hideCostPrice
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Toggle purchase cost display for privacy"
            >
              {hideCostPrice ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{hideCostPrice ? 'Cost Shield ON' : 'Cost Visible'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'मॉडल का नाम लिखें (उदा. M31, Y20, Note 10, Realme C11)...'
                  : 'Type model name (e.g. M31, Y20, Note 10, 105, 33W Charger)...'
              }
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Items Results Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <p className="font-semibold text-slate-700">No matching model or rate found</p>
              <p className="text-slate-400 mt-1">Try searching by brand or model keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredItems.map((item) => {
                const totalCustomerPrice =
                  item.sellingPrice + (item.category === 'display' ? item.fittingCharge || 0 : 0);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-50/70 border border-slate-200 hover:border-blue-300 p-4 rounded-xl space-y-2.5 transition-all hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{item.modelName}</span>
                          {item.qualityGrade && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-bold">
                              {item.qualityGrade}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-blue-600 font-semibold mt-0.5">
                          {item.brand} {item.subCategory ? `• ${item.subCategory}` : ''}
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          item.quantity > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.quantity > 0 ? `${item.quantity} in Stock` : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Rates Matrix */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Customer Price (Part):</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          ₹{item.sellingPrice}
                        </span>
                      </div>

                      {item.category === 'display' && item.fittingCharge ? (
                        <div className="flex justify-between items-center text-cyan-700">
                          <span>Fitting / Labor Charge:</span>
                          <span className="font-mono font-semibold">+₹{item.fittingCharge}</span>
                        </div>
                      ) : null}

                      {item.category === 'display' && (
                        <div className="flex justify-between items-center pt-1 border-t border-slate-100 font-bold text-slate-900">
                          <span>Total with Fitting:</span>
                          <span className="font-mono text-blue-600 text-base">
                            ₹{totalCustomerPrice}
                          </span>
                        </div>
                      )}

                      {/* Cost details (hidden or visible) */}
                      {!hideCostPrice && (
                        <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                          <span>
                            Cost: <strong>₹{item.purchasePrice}</strong>
                          </span>
                          {item.wholesalePrice && (
                            <span>
                              Wholesale: <strong>₹{item.wholesalePrice}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom rack & Sell Action */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{item.locationRack || 'Drawer location not set'}</span>
                      </span>

                      {onSelectForSale && item.quantity > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectForSale(item);
                          }}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>Bill Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
