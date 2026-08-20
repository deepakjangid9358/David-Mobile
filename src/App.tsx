/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StockItem,
  SaleTransaction,
  ShopProfile,
  ItemCategory,
} from './types';
import {
  getSavedStock,
  saveStock,
  getSavedSales,
  saveSales,
  getShopProfile,
  saveShopProfile,
  getLanguagePreference,
  saveLanguagePreference,
} from './utils/storage';
import { exportStockToExcel } from './utils/exportExcel';
import { triggerAutoBackupIfEnabled } from './utils/googleDrive';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { ItemManager } from './components/ItemManager';
import { ItemFormModal } from './components/ItemFormModal';
import { SalesBillingModal } from './components/SalesBillingModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SalesHistory } from './components/SalesHistory';
import { KhataManager } from './components/KhataManager';
import { QuickPriceLookup } from './components/QuickPriceLookup';
import { ShopSettingsModal } from './components/ShopSettingsModal';
import { GoogleDriveBackupModal } from './components/GoogleDriveBackupModal';

export default function App() {
  // State Initialization from Persistent LocalStorage
  const [items, setItems] = useState<StockItem[]>(() => getSavedStock());
  const [sales, setSales] = useState<SaleTransaction[]>(() => getSavedSales());
  const [shopProfile, setShopProfile] = useState<ShopProfile>(() => getShopProfile());
  const [lang, setLang] = useState<'en' | 'hi'>(() => getLanguagePreference());

  // Global Search State across all categories
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Navigation & View State
  const [activeView, setActiveView] = useState<'inventory' | 'sales' | 'khata' | 'quoter'>('inventory');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'display' | 'keypad' | 'accessory'>('all');
  const [isLowStockFiltered, setIsLowStockFiltered] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [itemModalDefaultCategory, setItemModalDefaultCategory] = useState<ItemCategory>('display');

  const [isSalesBillingOpen, setIsSalesBillingOpen] = useState(false);
  const [billingInitialItem, setBillingInitialItem] = useState<StockItem | null>(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceiptSale, setActiveReceiptSale] = useState<SaleTransaction | null>(null);

  const [isQuoterOpen, setIsQuoterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGDriveModalOpen, setIsGDriveModalOpen] = useState(false);

  // Live Auto-Backup Sync Status
  const [autoSyncStatus, setAutoSyncStatus] = useState<{
    status: 'idle' | 'syncing' | 'synced' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const isInitialMount = useRef(true);

  // Persistence Effects
  useEffect(() => {
    saveStock(items);
  }, [items]);

  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  useEffect(() => {
    saveShopProfile(shopProfile);
  }, [shopProfile]);

  useEffect(() => {
    saveLanguagePreference(lang);
  }, [lang]);

  // Automatic Google Drive Sync on Item or Sales mutations
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    triggerAutoBackupIfEnabled(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        shopProfile,
        items,
        sales,
      },
      (status, msg) => {
        setAutoSyncStatus({ status, message: msg });
        if (status === 'synced') {
          setTimeout(() => {
            setAutoSyncStatus((prev) => (prev.status === 'synced' ? { status: 'idle' } : prev));
          }, 3500);
        }
      }
    );
  }, [items, sales]);

  // Global Search Handler
  const handleGlobalSearchChange = (query: string) => {
    setGlobalSearchQuery(query);
    if (query.trim() && activeView !== 'inventory') {
      setActiveView('inventory');
    }
  };

  const handleClearGlobalSearch = () => {
    setGlobalSearchQuery('');
  };

  // Count matching items for global search
  const totalMatchingItems = globalSearchQuery.trim()
    ? items.filter((item) => {
        const q = globalSearchQuery.toLowerCase();
        return (
          item.brand.toLowerCase().includes(q) ||
          item.modelName.toLowerCase().includes(q) ||
          (item.grade && item.grade.toLowerCase().includes(q)) ||
          (item.rackLocation && item.rackLocation.toLowerCase().includes(q)) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        );
      }).length
    : undefined;

  // Language toggle
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // Low stock counter & filter
  const lowStockCount = items.filter((i) => i.stockQuantity <= (i.minStockAlert || 2)).length;
  const toggleLowStockFilter = () => {
    setIsLowStockFiltered((prev) => !prev);
    if (activeView !== 'inventory') {
      setActiveView('inventory');
    }
  };

  // Item Handlers
  const handleSaveItem = (itemData: StockItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === itemData.id);
      if (exists) {
        return prev.map((i) => (i.id === itemData.id ? itemData : i));
      }
      return [itemData, ...prev];
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateStockDelta = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.stockQuantity + delta);
          return { ...item, stockQuantity: newQty, updatedAt: new Date().toISOString() };
        }
        return item;
      })
    );
  };

  // Sales Handlers
  const handleCompleteSale = (saleData: SaleTransaction) => {
    // 1. Add to sales history
    setSales((prev) => [saleData, ...prev]);

    // 2. Decrement inventory stock automatically
    setItems((prevItems) => {
      const updated = [...prevItems];
      saleData.items.forEach((soldItem) => {
        const soldId = soldItem.itemId || soldItem.stockItemId;
        const index = updated.findIndex((i) => i.id === soldId);
        if (index !== -1) {
          const current = updated[index];
          const currQty = current.quantity ?? 0;
          const newQty = Math.max(0, currQty - soldItem.quantity);
          updated[index] = {
            ...current,
            quantity: newQty,
            updatedAt: new Date().toISOString(),
          };
        }
      });
      return updated;
    });

    // 3. Open receipt automatically
    setActiveReceiptSale(saleData);
    setIsReceiptOpen(true);
  };

  const handleDeleteSale = (saleId: string) => {
    setSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  const handleUpdateSaleTransaction = (updatedSale: SaleTransaction) => {
    setSales((prev) => prev.map((s) => (s.id === updatedSale.id ? updatedSale : s)));
  };

  // Restore/Backup Data
  const handleRestoreData = (
    restoredItems: StockItem[],
    restoredSales: SaleTransaction[],
    restoredProfile?: ShopProfile
  ) => {
    setItems(restoredItems);
    setSales(restoredSales);
    if (restoredProfile) {
      setShopProfile(restoredProfile);
    }
  };

  // Navigation / Modal triggers
  const openNewItemModal = (cat: ItemCategory = 'display') => {
    setEditingItem(null);
    setItemModalDefaultCategory(cat);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: StockItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const openNewSaleModal = (item?: StockItem) => {
    setBillingInitialItem(item || null);
    setIsSalesBillingOpen(true);
  };

  const openViewReceipt = (sale: SaleTransaction) => {
    setActiveReceiptSale(sale);
    setIsReceiptOpen(true);
  };

  // Global Excel Export
  const handleExportFullExcel = () => {
    exportStockToExcel(items, shopProfile.shopName || 'David_Mobile');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased text-slate-800 overflow-hidden">
      {/* Sleek Sidebar Navigation */}
      <Sidebar
        shopProfile={shopProfile}
        lang={lang}
        activeView={activeView}
        setActiveView={setActiveView}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        lowStockCount={lowStockCount}
        onFilterLowStock={toggleLowStockFilter}
        isLowStockFiltered={isLowStockFiltered}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenQuoter={() => setIsQuoterOpen(true)}
        onOpenGDriveBackup={() => setIsGDriveModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-100">
        {/* Sleek Header with Global Search, Excel Export & Google Drive Backup */}
        <Header
          shopProfile={shopProfile}
          lang={lang}
          onToggleLang={toggleLanguage}
          onOpenNewItem={() => openNewItemModal('display')}
          onOpenNewSale={() => openNewSaleModal()}
          onOpenQuoter={() => setIsQuoterOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenGDriveBackup={() => setIsGDriveModalOpen(true)}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          searchQuery={globalSearchQuery}
          onSearchChange={handleGlobalSearchChange}
          onClearSearch={handleClearGlobalSearch}
          totalMatchingItems={totalMatchingItems}
          onExportExcel={handleExportFullExcel}
          autoSyncStatus={autoSyncStatus}
        />

        {/* Scrollable Dashboard / View Body */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Metrics Cards */}
          <DashboardStats
            items={items}
            sales={sales}
            lang={lang}
            onOpenLowStock={toggleLowStockFilter}
            onOpenSalesHistory={() => setActiveView('sales')}
            onOpenKhata={() => setActiveView('khata')}
            isLowStockActive={isLowStockFiltered}
          />

          {/* Active View Title & Category Filter Badges */}
          {activeView === 'inventory' && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'hi' ? 'कैटेगरी फ़िल्टर:' : 'Filter Category:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsLowStockFiltered(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedCategory === 'all' && !isLowStockFiltered
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {lang === 'hi' ? 'सभी' : 'All'} ({items.length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('display');
                      setIsLowStockFiltered(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedCategory === 'display' && !isLowStockFiltered
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {lang === 'hi' ? 'मोबाइल डिस्प्ले (Folder)' : 'Display Folders'} (
                    {items.filter((i) => i.category === 'display').length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('keypad');
                      setIsLowStockFiltered(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedCategory === 'keypad' && !isLowStockFiltered
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {lang === 'hi' ? 'कीपैड मोबाइल' : 'Keypad Phones'} (
                    {items.filter((i) => i.category === 'keypad').length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('accessory');
                      setIsLowStockFiltered(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedCategory === 'accessory' && !isLowStockFiltered
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {lang === 'hi' ? 'एक्सेसरीज' : 'Accessories'} (
                    {items.filter((i) => i.category === 'accessory').length})
                  </button>
                </div>
              </div>

              {isLowStockFiltered && (
                <div className="flex items-center gap-2 bg-rose-50 text-rose-800 px-3 py-1 rounded-lg border border-rose-200 text-xs font-bold">
                  <span>Filtered: Low Stock Items Only</span>
                  <button
                    onClick={() => setIsLowStockFiltered(false)}
                    className="text-rose-600 hover:text-rose-900 underline ml-1"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View Components */}
          {activeView === 'inventory' && (
            <ItemManager
              items={items}
              lang={lang}
              selectedCategory={selectedCategory}
              isLowStockFiltered={isLowStockFiltered}
              onEditItem={openEditItemModal}
              onDeleteItem={handleDeleteItem}
              onUpdateStock={handleUpdateStockDelta}
              onQuickSell={(it) => openNewSaleModal(it)}
              onAddNewItem={() => openNewItemModal()}
              globalSearchQuery={globalSearchQuery}
              onClearGlobalSearch={handleClearGlobalSearch}
            />
          )}

          {activeView === 'sales' && (
            <SalesHistory
              sales={sales}
              shopProfile={shopProfile}
              lang={lang}
              onViewReceipt={openViewReceipt}
              onDeleteSale={handleDeleteSale}
            />
          )}

          {activeView === 'khata' && (
            <KhataManager
              sales={sales}
              shopProfile={shopProfile}
              lang={lang}
              onUpdateSale={handleUpdateSaleTransaction}
              onViewReceipt={openViewReceipt}
            />
          )}
        </section>

        {/* Minimal Footer */}
        <footer className="px-8 py-3 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between print:hidden">
          <span>{shopProfile.shopName} &bull; David Mobile Stock & Billing</span>
          <span className="text-[11px] text-slate-400">Google Drive Cloud Sync Enabled</span>
        </footer>
      </main>

      {/* Modals */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        defaultCategory={itemModalDefaultCategory}
        lang={lang}
      />

      <SalesBillingModal
        isOpen={isSalesBillingOpen}
        onClose={() => setIsSalesBillingOpen(false)}
        items={items}
        onCompleteSale={handleCompleteSale}
        initialSelectedItem={billingInitialItem}
        lang={lang}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        sale={activeReceiptSale}
        shopProfile={shopProfile}
        lang={lang}
      />

      <QuickPriceLookup
        isOpen={isQuoterOpen}
        onClose={() => setIsQuoterOpen(false)}
        items={items}
        lang={lang}
        onSelectForSale={(it) => openNewSaleModal(it)}
      />

      <ShopSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        shopProfile={shopProfile}
        onSaveProfile={setShopProfile}
        items={items}
        sales={sales}
        onRestoreData={handleRestoreData}
        lang={lang}
        onOpenGDriveBackup={() => setIsGDriveModalOpen(true)}
      />

      {/* Google Drive Cloud Backup & Restore Modal */}
      <GoogleDriveBackupModal
        isOpen={isGDriveModalOpen}
        onClose={() => setIsGDriveModalOpen(false)}
        items={items}
        sales={sales}
        shopProfile={shopProfile}
        onRestoreData={handleRestoreData}
        lang={lang}
      />
    </div>
  );
}
