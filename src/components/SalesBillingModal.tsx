import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  DollarSign,
  Smartphone,
  Radio,
  Headphones,
  CreditCard,
  Phone,
  User,
  Wrench,
} from 'lucide-react';
import { StockItem, SaleItem, SaleTransaction, PaymentMode } from '../types';
import { translations } from '../utils/translations';

interface SalesBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StockItem[];
  onCompleteSale: (sale: SaleTransaction) => void;
  initialSelectedItem?: StockItem | null;
  lang: 'en' | 'hi';
}

export const SalesBillingModal: React.FC<SalesBillingModalProps> = ({
  isOpen,
  onClose,
  items,
  onCompleteSale,
  initialSelectedItem,
  lang,
}) => {
  const t = translations[lang];

  // Bill State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [billItems, setBillItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState<number | ''>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [paidAmount, setPaidAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Item Search Picker
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
  const [itemQty, setItemQty] = useState<number>(1);
  const [customUnitPrice, setCustomUnitPrice] = useState<number | ''>('');
  const [fittingCharge, setFittingCharge] = useState<number | ''>(0);

  // Initialize with passed item
  useEffect(() => {
    if (initialSelectedItem) {
      addItemToCart(initialSelectedItem);
    }
  }, [initialSelectedItem, isOpen]);

  // Reset bill when modal closes or opens fresh
  useEffect(() => {
    if (!isOpen) {
      setCustomerName('');
      setCustomerPhone('');
      setBillItems([]);
      setDiscount(0);
      setPaymentMode('cash');
      setPaidAmount('');
      setNotes('');
      setSelectedStockItem(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addItemToCart = (stockIt: StockItem) => {
    const existingIndex = billItems.findIndex((b) => b.itemId === stockIt.id);
    const unitP = stockIt.sellingPrice;
    const fitting = stockIt.category === 'display' ? stockIt.fittingCharge || 0 : 0;
    const itemProfit = unitP + fitting - stockIt.purchasePrice;

    if (existingIndex > -1) {
      const updated = [...billItems];
      const existing = updated[existingIndex];
      const newQty = existing.quantity + 1;
      updated[existingIndex] = {
        ...existing,
        quantity: newQty,
        total: (existing.unitPrice + (existing.fittingCharge || 0)) * newQty,
        profit: itemProfit * newQty,
      };
      setBillItems(updated);
    } else {
      const newItem: SaleItem = {
        itemId: stockIt.id,
        itemName: `${stockIt.brand} ${stockIt.modelName} ${
          stockIt.qualityGrade ? `(${stockIt.qualityGrade})` : ''
        }`.trim(),
        category: stockIt.category,
        quantity: 1,
        unitPrice: unitP,
        costPrice: stockIt.purchasePrice,
        fittingCharge: fitting,
        total: unitP + fitting,
        profit: itemProfit,
      };
      setBillItems([...billItems, newItem]);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) return;

    const unitP = customUnitPrice !== '' ? Number(customUnitPrice) : selectedStockItem.sellingPrice;
    const fitting = fittingCharge !== '' ? Number(fittingCharge) : 0;
    const qty = Math.max(1, Number(itemQty) || 1);
    const singleProfit = unitP + fitting - selectedStockItem.purchasePrice;

    const newItem: SaleItem = {
      itemId: selectedStockItem.id,
      itemName: `${selectedStockItem.brand} ${selectedStockItem.modelName} ${
        selectedStockItem.qualityGrade ? `(${selectedStockItem.qualityGrade})` : ''
      }`.trim(),
      category: selectedStockItem.category,
      quantity: qty,
      unitPrice: unitP,
      costPrice: selectedStockItem.purchasePrice,
      fittingCharge: fitting,
      total: (unitP + fitting) * qty,
      profit: singleProfit * qty,
    };

    setBillItems([...billItems, newItem]);
    setSelectedStockItem(null);
    setSearchQuery('');
    setItemQty(1);
    setCustomUnitPrice('');
    setFittingCharge(0);
  };

  const handleRemoveItem = (index: number) => {
    setBillItems(billItems.filter((_, idx) => idx !== index));
  };

  const handleUpdateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const updated = [...billItems];
    const it = updated[index];
    const singleProfit = it.unitPrice + (it.fittingCharge || 0) - it.costPrice;
    updated[index] = {
      ...it,
      quantity: newQty,
      total: (it.unitPrice + (it.fittingCharge || 0)) * newQty,
      profit: singleProfit * newQty,
    };
    setBillItems(updated);
  };

  // Calculations
  const subtotal = billItems.reduce((sum, it) => sum + (it.unitPrice * it.quantity), 0);
  const fittingTotal = billItems.reduce((sum, it) => sum + ((it.fittingCharge || 0) * it.quantity), 0);
  const finalDiscount = discount !== '' ? Number(discount) : 0;
  const grandTotal = Math.max(0, subtotal + fittingTotal - finalDiscount);
  const actualPaid = paidAmount !== '' ? Number(paidAmount) : grandTotal;
  const dueAmount = Math.max(0, grandTotal - actualPaid);

  const handleCompleteSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (billItems.length === 0) {
      alert('Please add at least one item to the sale bill.');
      return;
    }

    const newSale: SaleTransaction = {
      id: `sale_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      customerName: customerName.trim() || 'Walk-in Customer (नकद ग्राहक)',
      customerPhone: customerPhone.trim() || undefined,
      items: billItems.map((b) => ({
        ...b,
        totalPrice: b.total || (b.unitPrice + (b.fittingCharge || 0)) * b.quantity,
      })),
      subtotal,
      fittingTotal,
      totalAmount: grandTotal,
      discount: finalDiscount,
      paidAmount: actualPaid,
      dueAmount: dueAmount,
      paymentMode,
      paymentStatus: dueAmount === 0 ? 'paid' : actualPaid === 0 ? 'due' : 'partial',
      notes: notes.trim() || undefined,
      date: new Date().toISOString(),
    };

    onCompleteSale(newSale);
    onClose();
  };

  // Filtered available items for search dropdown
  const filteredStock = searchQuery.trim()
    ? items.filter((it) => {
        const q = searchQuery.toLowerCase();
        return (
          it.modelName.toLowerCase().includes(q) ||
          it.brand.toLowerCase().includes(q) ||
          it.qualityGrade?.toLowerCase().includes(q) ||
          it.subCategory?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {lang === 'hi' ? 'नया बिक्री बिल (POS Billing)' : 'New Sales Billing'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'सामान चुनें, कस्टमर डिटेल डालें और व्हाट्सएप/प्रिंट बिल बनाएं'
                  : 'Fast POS billing with auto-stock deduction and WhatsApp receipt'}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Item Selection & Items Table (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Quick Item Search Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>{lang === 'hi' ? '1. सामान खोजें व बिल में जोड़ें' : '1. Search & Add Items'}</span>
                <span className="text-[11px] text-blue-600 font-normal">
                  {items.length} models available
                </span>
              </h3>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'डिस्प्ले मॉडल (e.g. M31, Y20), कीपैड या केबल खोजें...'
                      : 'Type brand, display model (e.g. Note 10), or accessory...'
                  }
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Instant Search Results Dropdown */}
                {filteredStock.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-52 overflow-y-auto divide-y divide-slate-100">
                    {filteredStock.slice(0, 8).map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => {
                          setSelectedStockItem(it);
                          setCustomUnitPrice(it.sellingPrice);
                          setFittingCharge(it.category === 'display' ? it.fittingCharge || 0 : 0);
                          setSearchQuery('');
                        }}
                        className="w-full p-2.5 text-left hover:bg-slate-50 flex items-center justify-between transition text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">
                            {it.brand} {it.modelName}{' '}
                            {it.qualityGrade && (
                              <span className="text-amber-700 text-[10px] font-bold">
                                [{it.qualityGrade}]
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Stock: <strong>{it.quantity} pcs</strong> &bull; Rack: {it.locationRack || '—'}
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-slate-900">
                            ₹{it.sellingPrice}
                          </span>
                          {it.fittingCharge ? (
                            <div className="text-[10px] text-cyan-600">
                              +₹{it.fittingCharge} fitting
                            </div>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Item Quick Add Config */}
              {selectedStockItem && (
                <div className="bg-white p-3.5 rounded-lg border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {selectedStockItem.brand} {selectedStockItem.modelName}{' '}
                      {selectedStockItem.qualityGrade ? `(${selectedStockItem.qualityGrade})` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedStockItem(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={customUnitPrice}
                        onChange={(e) =>
                          setCustomUnitPrice(e.target.value === '' ? '' : Number(e.target.value))
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>

                    {selectedStockItem.category === 'display' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Fitting (₹)
                        </label>
                        <input
                          type="number"
                          value={fittingCharge}
                          onChange={(e) =>
                            setFittingCharge(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono text-cyan-700"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedStockItem.quantity}
                        value={itemQty}
                        onChange={(e) => setItemQty(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualAdd}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to Bill</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bill Cart Items Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>{lang === 'hi' ? 'बिल में शामिल सामान' : 'Bill Items'} ({billItems.length})</span>
                {billItems.length > 0 && (
                  <button
                    onClick={() => setBillItems([])}
                    className="text-rose-600 hover:underline text-[10px] font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {billItems.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p>{lang === 'hi' ? 'अभी कोई सामान नहीं जोड़ा गया है।' : 'No items added to bill yet.'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'ऊपर सर्च बॉक्स से सामान जोड़ें।' : 'Search items above to add.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {billItems.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">{item.itemName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ₹{item.unitPrice} {item.fittingCharge ? `+ ₹${item.fittingCharge} fit` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, item.quantity - 1)}
                          className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-slate-800 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, item.quantity + 1)}
                          className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right font-mono font-bold text-slate-900 min-w-[65px]">
                        ₹{item.total}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customer Info & Payment Checkout (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'hi' ? '2. ग्राहक विवरण' : '2. Customer Details'}
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === 'hi' ? 'व्हाट्सएप फोन नंबर' : 'Phone / WhatsApp'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile for WhatsApp bill"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === 'hi' ? 'भुगतान प्रकार (Payment Mode)' : 'Payment Mode'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('cash')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      paymentMode === 'cash'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💵 Cash
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('upi')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      paymentMode === 'upi'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📱 UPI / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      paymentMode === 'card'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💳 Card / POS
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('credit');
                      setPaidAmount(0);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      paymentMode === 'credit'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📒 Udhari (Khata)
                  </button>
                </div>
              </div>

              {/* Discount & Received Amount */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Received (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder={grandTotal.toString()}
                    value={paidAmount}
                    onChange={(e) =>
                      setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Total Calculation Summary Card */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                {finalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono">-₹{finalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-1.5">
                  <span>Total Payable:</span>
                  <span className="font-mono text-blue-600 font-bold text-base">
                    ₹{grandTotal}
                  </span>
                </div>
                {dueAmount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-rose-600 border-t border-dashed border-slate-200 pt-1">
                    <span>Pending Due (उधारी):</span>
                    <span className="font-mono">₹{dueAmount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              id="btn-confirm-sale-submit"
              type="button"
              onClick={handleCompleteSaleSubmit}
              disabled={billItems.length === 0}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 disabled:opacity-40 transition-all uppercase tracking-wider active:scale-98"
            >
              {lang === 'hi' ? 'बिल तैयार करें एवं रसीद देखें' : 'Confirm Sale & Generate Bill'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
