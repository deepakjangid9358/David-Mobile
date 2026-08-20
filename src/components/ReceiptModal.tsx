import React from 'react';
import {
  X,
  Printer,
  Share2,
  CheckCircle,
  Smartphone,
  Calendar,
  User,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { SaleTransaction, ShopProfile } from '../types';
import { translations } from '../utils/translations';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleTransaction | null;
  shopProfile: ShopProfile;
  lang: 'en' | 'hi';
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  sale,
  shopProfile,
  lang,
}) => {
  const t = translations[lang];

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = sale.items.reduce((sum, item) => sum + (item.total || item.quantity * item.unitPrice), 0);

  // Generate WhatsApp formatted invoice text
  const generateWhatsAppMessage = () => {
    let msg = `*🧾 ${shopProfile.shopName.toUpperCase()}*\n`;
    if (shopProfile.address) msg += `📍 ${shopProfile.address}, ${shopProfile.city}\n`;
    msg += `📞 Mo: ${shopProfile.phone}\n`;
    msg += `--------------------------------\n`;
    msg += `*INVOICE: #${sale.invoiceNumber}*\n`;
    msg += `Date: ${new Date(sale.date).toLocaleDateString('en-IN')}\n`;
    msg += `Customer: ${sale.customerName} ${sale.customerPhone ? `(${sale.customerPhone})` : ''}\n`;
    msg += `--------------------------------\n`;
    msg += `*ITEMS BILLED:*\n`;

    sale.items.forEach((item, index) => {
      msg += `${index + 1}. *${item.itemName}*\n`;
      msg += `   Qty: ${item.quantity} x ₹${item.unitPrice}`;
      if (item.fittingCharge && item.fittingCharge > 0) {
        msg += ` + Fitting ₹${item.fittingCharge}`;
      }
      msg += ` = ₹${item.total}\n`;
    });

    msg += `--------------------------------\n`;
    if (sale.discount && sale.discount > 0) {
      msg += `Discount: -₹${sale.discount}\n`;
    }
    msg += `*GRAND TOTAL: ₹${sale.totalAmount}*\n`;
    msg += `Payment Mode: ${sale.paymentMode.toUpperCase()}\n`;
    msg += `Status: ${sale.paymentStatus.toUpperCase()} (Paid: ₹${sale.paidAmount}${
      sale.dueAmount > 0 ? `, Due: ₹${sale.dueAmount}` : ''
    })\n`;

    msg += `--------------------------------\n`;
    msg += `${shopProfile.invoiceFooterMessage || 'Thank you for your business!'}\n`;

    const encoded = encodeURIComponent(msg);
    const phoneParam = sale.customerPhone ? `91${sale.customerPhone.replace(/[^0-9]/g, '')}` : '';
    const url = phoneParam
      ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold font-mono">#{sale.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateWhatsAppMessage}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              title="Share on WhatsApp"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              title="Print Receipt"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 overflow-y-auto font-sans text-xs space-y-4">
          {/* Shop Header */}
          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
              {shopProfile.shopName}
            </h2>
            {shopProfile.tagline && (
              <p className="text-[11px] text-slate-500 font-medium">{shopProfile.tagline}</p>
            )}
            <p className="text-[11px] text-slate-500 mt-0.5">
              {shopProfile.address}, {shopProfile.city}
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-700 font-semibold mt-1">
              <span>Mob: {shopProfile.phone}</span>
              {shopProfile.alternatePhone && <span>/ {shopProfile.alternatePhone}</span>}
            </div>
            {shopProfile.gstin && (
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">GSTIN: {shopProfile.gstin}</p>
            )}
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">Invoice No:</span>
              <strong className="text-slate-900 font-mono">#{sale.invoiceNumber}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-medium">Date:</span>
              <strong className="text-slate-900">
                {new Date(sale.date).toLocaleDateString('en-IN')}{' '}
                {new Date(sale.date).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Customer:</span>
              <strong className="text-slate-900">{sale.customerName}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-medium">Phone:</span>
              <strong className="text-slate-900">{sale.customerPhone || 'Counter Sale'}</strong>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sale.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 pr-2">
                      <div className="font-semibold text-slate-900">{item.itemName}</div>
                      {item.fittingCharge && item.fittingCharge > 0 ? (
                        <div className="text-[10px] text-blue-600">
                          Fitting: +₹{item.fittingCharge}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-2.5 text-center font-mono font-semibold text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-600">₹{item.unitPrice}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="border-t border-slate-200 pt-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono">₹{subtotal}</span>
            </div>
            {sale.discount && sale.discount > 0 ? (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Offer:</span>
                <span className="font-mono">-₹{sale.discount}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-blue-600 font-bold">₹{sale.totalAmount}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-500">
                Paid via {sale.paymentMode.toUpperCase()} ({sale.paymentStatus.toUpperCase()}):
              </span>
              <span className="font-mono font-bold text-slate-900">₹{sale.paidAmount}</span>
            </div>
            {sale.dueAmount > 0 && (
              <div className="flex justify-between text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <span>Balance Due (उधारी):</span>
                <span className="font-mono text-sm">₹{sale.dueAmount}</span>
              </div>
            )}
          </div>

          {/* Warranty Terms & Footer */}
          <div className="border-t border-dashed border-slate-200 pt-3 text-[10px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Warranty: 30 Days Testing Warranty (Stamp must be intact)</span>
            </div>
            <p className="text-center font-medium text-slate-600 pt-1">
              {shopProfile.invoiceFooterMessage || 'Thank you for your visit!'}
            </p>
            <p className="text-center text-[9px] text-slate-400">
              * Goods once sold can be tested before final fitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
