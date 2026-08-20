import React, { useState } from 'react';
import {
  X,
  Store,
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  FileText,
  AlertTriangle,
  QrCode,
  Cloud,
} from 'lucide-react';
import { ShopProfile, StockItem, SaleTransaction } from '../types';
import { translations } from '../utils/translations';
import { SAMPLE_INITIAL_ITEMS, SAMPLE_INITIAL_SALES } from '../utils/storage';

interface ShopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopProfile: ShopProfile;
  onSaveProfile: (profile: ShopProfile) => void;
  items: StockItem[];
  sales: SaleTransaction[];
  onRestoreData: (items: StockItem[], sales: SaleTransaction[], profile?: ShopProfile) => void;
  lang: 'en' | 'hi';
  onOpenGDriveBackup?: () => void;
}

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  isOpen,
  onClose,
  shopProfile,
  onSaveProfile,
  items,
  sales,
  onRestoreData,
  lang,
  onOpenGDriveBackup,
}) => {
  const t = translations[lang];
  const [profile, setProfile] = useState<ShopProfile>(shopProfile);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'backup'>('profile');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
    setSuccessMsg(lang === 'hi' ? 'दुकान की जानकारी सेव हो गई!' : 'Shop settings saved successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      shopProfile: profile,
      items,
      sales,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${(profile.shopName || 'david_mobile').replace(/\s+/g, '_')}_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV for Excel
  const handleExportCSV = () => {
    const headers = ['Category', 'Model/Item Name', 'Brand/Grade', 'Purchase Rate (₹)', 'Customer Sale Rate (₹)', 'Current Stock (Qty)', 'Rack/Box Location'];
    const rows = items.map((item) => [
      item.category,
      `"${item.modelName.replace(/"/g, '""')}"`,
      `"${item.brand.replace(/"/g, '""')}"`,
      item.purchaseRate,
      item.customerRate,
      item.stockQuantity,
      `"${(item.rackLocation || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${(profile.shopName || 'david_mobile').replace(/\s+/g, '_')}_stock_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.items && Array.isArray(parsed.items)) {
          onRestoreData(parsed.items, parsed.sales || [], parsed.shopProfile);
          setSuccessMsg(
            lang === 'hi'
              ? `डेटा रीस्टोर सफल! (${parsed.items.length} आइटम लोड हुए)`
              : `Restore successful! (${parsed.items.length} items loaded)`
          );
          setTimeout(() => setSuccessMsg(''), 2000);
        } else {
          alert('अमान्य बैकअप फाइल (Invalid JSON format: missing items array)');
        }
      } catch (err) {
        alert('फाइल पढ़ने में त्रुटि (Error parsing JSON backup file)');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemoData = () => {
    if (
      window.confirm(
        lang === 'hi'
          ? 'क्या आप शुरुआती डेमो डेटा रीसेट करना चाहते हैं?'
          : 'Are you sure you want to reset to initial stock sample data?'
      )
    ) {
      onRestoreData(SAMPLE_INITIAL_ITEMS, SAMPLE_INITIAL_SALES);
      setSuccessMsg(lang === 'hi' ? 'डेमो डेटा रीसेट हो गया!' : 'Demo data reset!');
      setTimeout(() => setSuccessMsg(''), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Store className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {lang === 'hi' ? 'दुकान की प्रोफाइल और बैकअप' : 'Shop Settings & Backup'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'hi' ? 'दुकान का नाम, बिल हेडर और क्लाउड बैकअप' : 'Shop details, invoice print header & cloud backup'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>{lang === 'hi' ? 'दुकान की जानकारी (Profile)' : 'Shop Profile'}</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>{lang === 'hi' ? 'बैकअप और क्लाउड (Backup & Cloud)' : 'Backup & Restore'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'दुकान का नाम (Shop Name) *' : 'Shop Name *'}
                </label>
                <input
                  type="text"
                  value={profile.shopName}
                  onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                  placeholder="David Mobile"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'मालिक का नाम / टैगलाइन' : 'Owner Name / Subtitle'}
                </label>
                <input
                  type="text"
                  value={profile.ownerName || ''}
                  onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                  placeholder="Complete Mobile Solution & Accessories"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'मुख्य फोन नंबर (Primary Phone) *' : 'Primary Phone *'}
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="9053540404"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'अतिरिक्त फोन (Alternate Phone)' : 'Alternate Phone'}
                  </label>
                  <input
                    type="tel"
                    value={profile.alternatePhone || ''}
                    onChange={(e) => setProfile({ ...profile, alternatePhone: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'दुकान का पता (Address)' : 'Shop Address'}
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Shop No 7 Near HDFC Bank Bawal Road Karnawas"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'शहर / राज्य (City, State)' : 'City, State'}
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="Karnawas, Haryana"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    UPI ID ({lang === 'hi' ? 'पेमेंट QR के लिए' : 'For UPI Payments'})
                  </label>
                  <input
                    type="text"
                    value={profile.upiId || ''}
                    onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                    placeholder="e.g. 9053540404@okhdfcbank"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-blue-700 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GSTIN ({lang === 'hi' ? 'यदि हो तो' : 'Optional'})
                  </label>
                  <input
                    type="text"
                    value={profile.gstin || ''}
                    onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                    placeholder="06AAAAA0000A1Z5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'बिल के नीचे संदेश / वारंटी नियम' : 'Invoice Footer / Warranty Terms'}
                </label>
                <textarea
                  rows={2}
                  value={profile.invoiceFooterMessage || ''}
                  onChange={(e) => setProfile({ ...profile, invoiceFooterMessage: e.target.value })}
                  placeholder="Thank you for visiting David Mobile! 30-Day Testing Warranty on Folders."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>{lang === 'hi' ? 'सेटिंग्स सेव करें' : 'Save Shop Settings'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Google Drive Direct Sync Banner */}
              {onOpenGDriveBackup && (
                <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl border border-blue-800 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-blue-400" />
                      <h4 className="text-xs font-bold">
                        {lang === 'hi' ? 'गूगल ड्राइव क्लाउड बैकअप' : 'Google Drive Cloud Backup & Sync'}
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/80">
                    {lang === 'hi'
                      ? 'अपने गूगल अकाउंट से कनेक्ट करके डेटा को सुरक्षित ड्राइव में सेव और रीस्टोर करें।'
                      : 'Backup stock catalog, rates, and customer bills directly to your Google Drive.'}
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenGDriveBackup();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-xs"
                    >
                      <Cloud className="h-4 w-4" />
                      <span>{lang === 'hi' ? 'गूगल ड्राइव सिंक खोलें' : 'Open Google Drive Backup'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">
                  {lang === 'hi' ? 'ऑफलाइन डेटा बैकअप (Local Export)' : 'Local File Export'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'hi'
                    ? 'सभी डिस्प्ले रेट्स, कीपैड और एक्सेसरीज स्टॉक व सेल्स हिस्ट्री को कंप्यूटर में सेव करें।'
                    : 'Download full inventory rates and sales history as JSON or Excel CSV.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 transition shadow-xs"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-emerald-700 border border-emerald-200 transition shadow-xs"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Export Stock to Excel (CSV)</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">
                  {lang === 'hi' ? 'ऑफलाइन फाइल से रीस्टोर करें' : 'Restore from JSON File'}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'hi'
                    ? 'पहले डाउनलोड की गई बैकअप JSON फाइल चुनें।'
                    : 'Select a previously exported JSON backup file to restore.'}
                </p>

                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition shadow-sm">
                  <Upload className="h-4 w-4" />
                  <span>Choose Backup File (.json)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-700">
                  {lang === 'hi' ? 'डेमो डेटा लोड करें' : 'Reset / Load Demo Data'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Loads initial catalog of displays, keypad phones and accessories.
                </p>
                <button
                  onClick={handleResetDemoData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Load Sample Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
