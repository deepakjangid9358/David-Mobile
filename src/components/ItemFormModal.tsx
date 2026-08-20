import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Radio,
  Headphones,
  Save,
  PlusCircle,
  Tag,
  MapPin,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { StockItem, ItemCategory } from '../types';
import { translations } from '../utils/translations';
import {
  COMMON_BRANDS,
  DISPLAY_QUALITIES,
  ACCESSORY_TYPES,
  KEYPAD_BRANDS,
} from '../utils/storage';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: StockItem) => void;
  initialItem?: StockItem | null;
  defaultCategory?: ItemCategory;
  lang: 'en' | 'hi';
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultCategory = 'display',
  lang,
}) => {
  const t = translations[lang];

  const [category, setCategory] = useState<ItemCategory>(defaultCategory);
  const [brand, setBrand] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [qualityGrade, setQualityGrade] = useState('');
  const [customQuality, setCustomQuality] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [color, setColor] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [fittingCharge, setFittingCharge] = useState<number | ''>(150);
  const [wholesalePrice, setWholesalePrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>(5);
  const [minStockAlert, setMinStockAlert] = useState<number | ''>(2);
  const [locationRack, setLocationRack] = useState('');
  const [notes, setNotes] = useState('');
  const [warrantyDays, setWarrantyDays] = useState<number | ''>(30);

  // Sync state when modal opens or initialItem changes
  useEffect(() => {
    if (initialItem) {
      setCategory(initialItem.category);
      setBrand(initialItem.brand);
      setModelName(initialItem.modelName);
      setQualityGrade(initialItem.qualityGrade || '');
      setSubCategory(initialItem.subCategory || '');
      setColor(initialItem.color || '');
      setPurchasePrice(initialItem.purchasePrice);
      setSellingPrice(initialItem.sellingPrice);
      setFittingCharge(initialItem.fittingCharge !== undefined ? initialItem.fittingCharge : 150);
      setWholesalePrice(initialItem.wholesalePrice || '');
      setQuantity(initialItem.quantity);
      setMinStockAlert(initialItem.minStockAlert);
      setLocationRack(initialItem.locationRack || '');
      setNotes(initialItem.notes || '');
      setWarrantyDays(initialItem.warrantyDays || 30);
    } else {
      setCategory(defaultCategory);
      setBrand(defaultCategory === 'display' ? 'Samsung' : defaultCategory === 'keypad' ? 'Nokia' : 'Boat');
      setModelName('');
      setQualityGrade(defaultCategory === 'display' ? 'Original (100% OEM)' : '');
      setSubCategory(defaultCategory === 'accessory' ? 'Fast Charger (Type-C)' : '');
      setColor('');
      setPurchasePrice('');
      setSellingPrice('');
      setFittingCharge(defaultCategory === 'display' ? 150 : 0);
      setWholesalePrice('');
      setQuantity(5);
      setMinStockAlert(2);
      setLocationRack(defaultCategory === 'display' ? 'Box D-01' : 'Rack A-1');
      setNotes('');
      setWarrantyDays(defaultCategory === 'display' ? 30 : defaultCategory === 'keypad' ? 365 : 180);
    }
  }, [initialItem, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalBrand = brand === 'Other' ? customBrand.trim() : brand;
    const finalQuality = qualityGrade === 'Other' ? customQuality.trim() : qualityGrade;

    if (!finalBrand || !modelName.trim() || purchasePrice === '' || sellingPrice === '') {
      alert('Please fill in required fields (Brand, Model, Cost Price, Selling Rate)');
      return;
    }

    const itemToSave: StockItem = {
      id: initialItem ? initialItem.id : `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category,
      brand: finalBrand,
      modelName: modelName.trim(),
      qualityGrade: category === 'display' ? finalQuality : undefined,
      subCategory: category === 'accessory' ? subCategory : undefined,
      color: color.trim() || undefined,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      fittingCharge: category === 'display' && fittingCharge !== '' ? Number(fittingCharge) : undefined,
      wholesalePrice: wholesalePrice !== '' ? Number(wholesalePrice) : undefined,
      quantity: Number(quantity) || 0,
      minStockAlert: Number(minStockAlert) || 2,
      locationRack: locationRack.trim() || undefined,
      notes: notes.trim() || undefined,
      warrantyDays: warrantyDays !== '' ? Number(warrantyDays) : undefined,
      createdAt: initialItem ? initialItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(itemToSave);
    onClose();
  };

  const estimatedProfit =
    purchasePrice !== '' && sellingPrice !== '' ? Number(sellingPrice) - Number(purchasePrice) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              {category === 'display' ? (
                <Smartphone className="h-5 w-5" />
              ) : category === 'keypad' ? (
                <Radio className="h-5 w-5" />
              ) : (
                <Headphones className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {initialItem ? t.editItem : t.newItem}
              </h2>
              <p className="text-xs text-slate-400">
                {category === 'display'
                  ? 'Mobile Display / Combo Folder Rate & Stock'
                  : category === 'keypad'
                  ? 'Keypad Mobile Stock & Price'
                  : 'Accessories & Spare Parts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Category Picker Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {lang === 'hi' ? 'आइटम कैटेगरी चुनें' : '1. Select Category *'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('display')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                  category === 'display'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="h-4 w-4 text-blue-600" />
                <span>{lang === 'hi' ? 'डिस्प्ले फोल्डर' : 'Display Folder'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('keypad')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                  category === 'keypad'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Radio className="h-4 w-4 text-indigo-600" />
                <span>{lang === 'hi' ? 'कीपैड फोन' : 'Keypad Phone'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('accessory')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                  category === 'accessory'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Headphones className="h-4 w-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'एक्सेसरीज' : 'Accessories'}</span>
              </button>
            </div>
          </div>

          {/* Row: Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.brand} *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                {(category === 'display'
                  ? COMMON_BRANDS
                  : category === 'keypad'
                  ? KEYPAD_BRANDS
                  : [...COMMON_BRANDS, 'Boat', 'Noise', 'Portronics', 'Zebronics', 'Generic', 'Other']
                ).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {brand === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom brand"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.modelName} *
              </label>
              <input
                type="text"
                placeholder={
                  category === 'display'
                    ? 'e.g. Galaxy M31 / Y20 / Note 10'
                    : category === 'keypad'
                    ? 'e.g. 105 Dual SIM / Guru 1200'
                    : 'e.g. 33W Fast Charger with Cable'
                }
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Quality Grade (for Display) or SubCategory (for Accessories) */}
          {category === 'display' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'डिस्प्ले क्वालिटी (Quality Grade) *' : 'Display Quality Grade *'}
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {DISPLAY_QUALITIES.map((q) => (
                    <option key={q.label} value={q.label}>
                      {q.label} ({q.desc})
                    </option>
                  ))}
                  <option value="Other">Other / Custom</option>
                </select>
                {qualityGrade === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom quality grade"
                    value={customQuality}
                    onChange={(e) => setCustomQuality(e.target.value)}
                    className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fittingCharge} (₹)
                </label>
                <input
                  type="number"
                  placeholder="150"
                  value={fittingCharge}
                  onChange={(e) =>
                    setFittingCharge(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {category === 'accessory' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'एक्सेसरी प्रकार (Accessory Type)' : 'Accessory Type'}
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {ACCESSORY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing Grid */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>{lang === 'hi' ? 'रेट एवं मूल्य निर्धारण' : 'Rates & Pricing (₹)'}</span>
              {estimatedProfit > 0 && (
                <span className="text-xs text-emerald-600 font-bold">
                  Estimated Profit: +₹{estimatedProfit} / pc
                </span>
              )}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.costPrice} (₹) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1150"
                  value={purchasePrice}
                  onChange={(e) =>
                    setPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.sellingPrice} (₹) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1650"
                  value={sellingPrice}
                  onChange={(e) =>
                    setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t.wholesalePrice} (₹)
                </label>
                <input
                  type="number"
                  placeholder="Optional"
                  value={wholesalePrice}
                  onChange={(e) =>
                    setWholesalePrice(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Stock Quantities & Drawer Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.quantity} (Pcs) *
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.minStockAlert}
              </label>
              <input
                type="number"
                min="1"
                value={minStockAlert}
                onChange={(e) =>
                  setMinStockAlert(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.rackLocation}
              </label>
              <input
                type="text"
                placeholder="e.g. Box D-04 / Rack 2"
                value={locationRack}
                onChange={(e) => setLocationRack(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Color & Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'रंग (Color)' : 'Color / Variant'}
              </label>
              <input
                type="text"
                placeholder="Black / Blue / Gold"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'वारंटी (दिन)' : 'Testing Warranty (Days)'}
              </label>
              <input
                type="number"
                placeholder="30"
                value={warrantyDays}
                onChange={(e) =>
                  setWarrantyDays(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.notes}
            </label>
            <input
              type="text"
              placeholder="e.g. Supplier: Royal Spares Delhi, High brightness copy"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm hover:shadow"
            >
              <Save className="h-4 w-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
