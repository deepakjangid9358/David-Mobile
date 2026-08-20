import React, { useState } from 'react';
import {
  Users,
  Search,
  DollarSign,
  Phone,
  Share2,
  CheckCircle,
  Receipt,
  ArrowRight,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { SaleTransaction, ShopProfile } from '../types';
import { translations } from '../utils/translations';

interface KhataManagerProps {
  sales: SaleTransaction[];
  shopProfile: ShopProfile;
  lang: 'en' | 'hi';
  onUpdateSale: (updatedSale: SaleTransaction) => void;
  onViewReceipt: (sale: SaleTransaction) => void;
}

export const KhataManager: React.FC<KhataManagerProps> = ({
  sales,
  shopProfile,
  lang,
  onUpdateSale,
  onViewReceipt,
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSaleForPayment, setSelectedSaleForPayment] = useState<SaleTransaction | null>(null);
  const [collectAmount, setCollectAmount] = useState<number | ''>('');

  // Find all sales with pending due
  const dueSales = sales.filter((s) => (s.dueAmount || 0) > 0);

  // Filter dues
  const filteredDueSales = dueSales.filter((sale) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      sale.customerName.toLowerCase().includes(q) ||
      sale.customerPhone?.toLowerCase().includes(q) ||
      sale.invoiceNumber.toLowerCase().includes(q)
    );
  });

  const totalMarketDue = dueSales.reduce((sum, s) => sum + s.dueAmount, 0);

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleForPayment || collectAmount === '' || Number(collectAmount) <= 0) return;

    const amt = Number(collectAmount);
    const newPaid = selectedSaleForPayment.paidAmount + amt;
    const newDue = Math.max(0, selectedSaleForPayment.totalAmount - newPaid);

    const updatedSale: SaleTransaction = {
      ...selectedSaleForPayment,
      paidAmount: newPaid,
      dueAmount: newDue,
      paymentStatus: newDue === 0 ? 'paid' : 'partial',
      notes: `${selectedSaleForPayment.notes || ''} [Collected ₹${amt} on ${new Date().toLocaleDateString('en-IN')}]`.trim(),
    };

    onUpdateSale(updatedSale);
    setSelectedSaleForPayment(null);
    setCollectAmount('');
  };

  const sendWhatsAppReminder = (sale: SaleTransaction) => {
    let msg = `*Namaste ${sale.customerName} ji,*\n\n`;
    msg += `Reminder from *${shopProfile.shopName}*:\n`;
    msg += `Your balance of *₹${sale.dueAmount}* is pending against Bill #${sale.invoiceNumber} (Dated: ${new Date(
      sale.date
    ).toLocaleDateString('en-IN')}).\n\n`;
    if (shopProfile.upiId) {
      msg += `You can pay online via UPI to: *${shopProfile.upiId}*\n\n`;
    }
    msg += `Thank you,\n${shopProfile.ownerName || shopProfile.shopName} (${shopProfile.phone})`;

    const encoded = encodeURIComponent(msg);
    const phoneParam = sale.customerPhone ? `91${sale.customerPhone.replace(/[^0-9]/g, '')}` : '';
    const url = phoneParam
      ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {lang === 'hi' ? 'ग्राहक खाता एवं उधारी बही (Due Khata)' : 'Customer Credit & Due Book'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'hi'
                ? 'उधारी का हिसाब रखें, पेमेंट जमा करें और व्हाट्सएप पर तगादा / रिमाइंडर भेजें'
                : 'Track pending payments, collect dues, and send WhatsApp payment reminders'}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-200 text-left sm:text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {lang === 'hi' ? 'कुल बकाया उधारी' : 'Total Market Due'}
          </span>
          <span className="text-2xl font-bold text-rose-600 font-mono">
            ₹{totalMarketDue.toLocaleString('en-IN')}
          </span>
          <div className="text-[11px] text-slate-500">Across {dueSales.length} bills pending</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'ग्राहक का नाम या फोन नंबर से उधारी खोजें...'
                : 'Search pending due by customer name, phone, or invoice...'
            }
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Due Cards Grid */}
        {filteredDueSales.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <CheckCircle className="h-10 w-10 mx-auto mb-2 text-emerald-500" />
            <p className="font-bold text-slate-800">
              {lang === 'hi' ? 'कोई उधारी बाकी नहीं है!' : 'No pending dues! All clear.'}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              {lang === 'hi'
                ? 'सभी ग्राहकों का पूरा भुगतान प्राप्त हो चुका है।'
                : 'All customers have paid their balances in full.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDueSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-slate-50/70 border border-slate-200 hover:border-slate-300 p-5 rounded-xl space-y-3 transition-all hover:shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{sale.customerName}</span>
                      <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded font-bold">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
                      {sale.customerPhone ? (
                        <span className="flex items-center gap-1 text-slate-700">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{sale.customerPhone}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">No phone</span>
                      )}
                      <span>&bull;</span>
                      <span>#{sale.invoiceNumber}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Pending Due:
                    </span>
                    <span className="text-xl font-bold font-mono text-rose-600">
                      ₹{sale.dueAmount}
                    </span>
                  </div>
                </div>

                {/* Items & Date Summary */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-700 text-[11px] truncate">
                    <strong>Items:</strong>{' '}
                    {sale.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      Bill Total: ₹{sale.totalAmount} (Paid: ₹{sale.paidAmount})
                    </span>
                    <span>Date: {new Date(sale.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  {sale.notes && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded font-mono">
                      Note: {sale.notes}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewReceipt(sale)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 transition"
                      title="View Bill"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      <span>Bill</span>
                    </button>

                    <button
                      onClick={() => sendWhatsAppReminder(sale)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-emerald-200 transition"
                      title="Send WhatsApp Payment Reminder"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Reminder</span>
                    </button>
                  </div>

                  {/* Collect Payment Button */}
                  <button
                    onClick={() => {
                      setSelectedSaleForPayment(sale);
                      setCollectAmount(sale.dueAmount);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95"
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>{lang === 'hi' ? 'रुपये जमा करें' : 'Collect Due'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collect Payment Modal */}
      {selectedSaleForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'उधारी पेमेंट जमा करें' : 'Collect Pending Due'}</span>
              </h3>
              <button
                onClick={() => setSelectedSaleForPayment(null)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <strong className="text-slate-800">{selectedSaleForPayment.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="text-slate-700 font-mono font-bold">
                  #{selectedSaleForPayment.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between font-bold text-rose-600 border-t border-slate-200 pt-1.5">
                <span>Current Due Balance:</span>
                <span className="font-mono text-base">₹{selectedSaleForPayment.dueAmount}</span>
              </div>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'जमा की जाने वाली राशि (₹ Amount)' : 'Amount Received (₹)'}
                </label>
                <input
                  type="number"
                  max={selectedSaleForPayment.dueAmount}
                  value={collectAmount}
                  onChange={(e) =>
                    setCollectAmount(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono font-bold text-base focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSaleForPayment(null)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                >
                  Confirm & Update Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
