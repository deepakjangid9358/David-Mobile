import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Receipt,
  Trash2,
  Share2,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  Phone,
  ArrowDownRight,
} from 'lucide-react';
import { SaleTransaction, ShopProfile } from '../types';
import { translations } from '../utils/translations';
import { exportSalesToExcel } from '../utils/exportExcel';

interface SalesHistoryProps {
  sales: SaleTransaction[];
  shopProfile: ShopProfile;
  lang: 'en' | 'hi';
  onViewReceipt: (sale: SaleTransaction) => void;
  onDeleteSale: (id: string) => void;
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({
  sales,
  shopProfile,
  lang,
  onViewReceipt,
  onDeleteSale,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'this_week' | 'this_month'>('all');

  // Filter Sales
  const filteredSales = sales.filter((sale) => {
    // Payment Mode Filter
    if (filterMode !== 'all' && sale.paymentMode !== filterMode) return false;

    // Date Filter
    if (dateFilter !== 'all') {
      const saleDate = new Date(sale.date);
      const now = new Date();
      if (dateFilter === 'today') {
        if (saleDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === 'this_week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        if (saleDate < weekAgo) return false;
      } else if (dateFilter === 'this_month') {
        if (saleDate.getMonth() !== now.getMonth() || saleDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }
    }

    // Search Query Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = sale.customerName.toLowerCase().includes(q);
      const matchPhone = sale.customerPhone?.toLowerCase().includes(q) || false;
      const matchInvoice = sale.invoiceNumber.toLowerCase().includes(q);
      const matchItem = sale.items.some((i) => i.itemName.toLowerCase().includes(q));
      if (!matchName && !matchPhone && !matchInvoice && !matchItem) return false;
    }

    return true;
  });

  // KPI Calculations
  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = filteredSales.reduce((sum, s) => {
    const p = s.items.reduce((acc, it) => acc + (it.profit || 0), 0);
    return sum + (p - (s.discount || 0));
  }, 0);
  const totalCollected = filteredSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDuePending = filteredSales.reduce((sum, s) => sum + (s.dueAmount || 0), 0);

  // Quick WhatsApp Share
  const shareWhatsAppBill = (sale: SaleTransaction) => {
    let msg = `*${shopProfile.shopName}*\n`;
    msg += `Bill #${sale.invoiceNumber} | Date: ${new Date(sale.date).toLocaleDateString('en-IN')}\n`;
    msg += `Customer: ${sale.customerName}\n\n`;
    msg += `*Items:*\n`;
    sale.items.forEach((it, idx) => {
      msg += `${idx + 1}. ${it.itemName} (${it.quantity}x) = ₹${it.total || it.totalPrice || it.quantity * it.unitPrice}\n`;
    });
    if (sale.discount) msg += `Discount: -₹${sale.discount}\n`;
    msg += `*Total Amount:* ₹${sale.totalAmount}\n`;
    msg += `Paid: ₹${sale.paidAmount} (${sale.paymentMode.toUpperCase()})\n`;
    if (sale.dueAmount > 0) msg += `*Pending Due:* ₹${sale.dueAmount}\n`;
    msg += `\nThank you for visiting!`;

    const encoded = encodeURIComponent(msg);
    const phoneParam = sale.customerPhone ? `91${sale.customerPhone.replace(/[^0-9]/g, '')}` : '';
    const url = phoneParam
      ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 4 Sleek Sales Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'कुल बिक्री राजस्व' : 'Filtered Revenue'}
          </p>
          <p className="text-2xl font-bold text-slate-900">
            ₹{totalSalesRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            From {filteredSales.length} invoices
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'शुद्ध अनुमानित मुनाफा' : 'Net Margin'}
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            ₹{totalProfit.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">
            After fitting & parts cost
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'कुल प्राप्त राशि' : 'Amount Collected'}
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{totalCollected.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Cash / UPI / Card received
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'बकाया उधारी (Pending Due)' : 'Pending Customer Due'}
          </p>
          <p className="text-2xl font-bold text-rose-600">
            ₹{totalDuePending.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-rose-500 mt-2 font-medium">
            Trackable in Customer Khata
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="input-sales-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'बिल नंबर, ग्राहक नाम, फोन या सामान से खोजें...'
                  : 'Search by customer, invoice #, phone, or item...'
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Date Quick Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs shadow-xs">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  dateFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  dateFilter === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('this_week')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  dateFilter === 'this_week'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateFilter('this_month')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  dateFilter === 'this_month'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                This Month
              </button>
            </div>

            {/* Payment Mode Filter */}
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-blue-500 outline-none shadow-xs"
            >
              <option value="all">All Modes</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI / Online</option>
              <option value="card">Card</option>
              <option value="credit">Credit / Udhari</option>
            </select>

            {/* Export Sales to Excel Button */}
            <button
              id="btn-sales-export-excel"
              onClick={() => exportSalesToExcel(filteredSales, shopProfile.shopName)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition shadow-2xs"
              title="Download Sales Report as Excel (.csv)"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'एक्सेल रिपोर्ट' : 'Export Excel'}</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="flex-1 overflow-x-auto">
          {filteredSales.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-500">
              <Receipt className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">
                {lang === 'hi' ? 'कोई बिक्री रिकॉर्ड नहीं मिला' : 'No sales transactions found'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'hi'
                  ? 'नया बिल बनाने के लिए New Sale पर क्लिक करें।'
                  : 'Start billing to view recent invoices and revenue logs.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">{lang === 'hi' ? 'बिल नंबर व तारीख' : 'Invoice & Date'}</th>
                  <th className="px-6 py-3.5">{lang === 'hi' ? 'ग्राहक' : 'Customer'}</th>
                  <th className="px-6 py-3.5">{lang === 'hi' ? 'सामान' : 'Items Sold'}</th>
                  <th className="px-6 py-3.5">{lang === 'hi' ? 'पेमेंट मोड' : 'Payment Mode'}</th>
                  <th className="px-6 py-3.5 text-right">{lang === 'hi' ? 'कुल बिल' : 'Total'}</th>
                  <th className="px-6 py-3.5 text-right">{lang === 'hi' ? 'मुनाफा' : 'Profit'}</th>
                  <th className="px-6 py-3.5 text-right">{lang === 'hi' ? 'एक्शन' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Invoice & Date */}
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-blue-600 text-xs">
                        #{sale.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(sale.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{sale.customerName}</div>
                      {sale.customerPhone && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{sale.customerPhone}</span>
                        </div>
                      )}
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-700 max-w-xs space-y-0.5">
                        {sale.items.map((it, idx) => (
                          <div key={idx} className="truncate">
                            <span className="font-semibold text-slate-900">{it.quantity}x</span>{' '}
                            <span>{it.itemName}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Payment Mode */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          sale.paymentMode === 'cash'
                            ? 'bg-emerald-50 text-emerald-600'
                            : sale.paymentMode === 'upi'
                            ? 'bg-blue-50 text-blue-600'
                            : sale.paymentMode === 'credit'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {sale.paymentMode.toUpperCase()}
                      </span>
                      {sale.dueAmount > 0 && (
                        <div className="text-[10px] text-rose-600 font-bold mt-1">
                          Due: ₹{sale.dueAmount}
                        </div>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 text-right font-medium text-slate-900 font-mono">
                      <div>₹{sale.totalAmount.toLocaleString('en-IN')}</div>
                      {sale.discount && sale.discount > 0 ? (
                        <div className="text-[10px] text-slate-400">Disc: -₹{sale.discount}</div>
                      ) : null}
                    </td>

                    {/* Profit */}
                    <td className="px-6 py-4 text-right font-mono text-xs text-emerald-600 font-semibold">
                      +₹{sale.items.reduce((s, i) => s + i.profit, 0) - (sale.discount || 0)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReceipt(sale)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="View & Print Bill"
                        >
                          <Receipt className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => shareWhatsAppBill(sale)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete bill #${sale.invoiceNumber}?`)) {
                              onDeleteSale(sale.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Bill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
