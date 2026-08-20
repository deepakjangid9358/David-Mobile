export interface Translations {
  appTitle: string;
  appSubtitle: string;
  allStock: string;
  displaysTab: string;
  keypadTab: string;
  accessoriesTab: string;
  salesBilling: string;
  salesHistory: string;
  dueKhata: string;
  priceQuoter: string;
  settings: string;
  newItem: string;
  newSale: string;
  searchPlaceholder: string;
  totalStockValue: string;
  purchaseValue: string;
  sellingValue: string;
  totalProducts: string;
  lowStockItems: string;
  todaySales: string;
  todayProfit: string;
  costPrice: string;
  sellPrice: string;
  wholesalePrice: string;
  fittingCharge: string;
  stockQty: string;
  profitMargin: string;
  rackLocation: string;
  quality: string;
  category: string;
  brand: string;
  model: string;
  actions: string;
  saveItem: string;
  editItem: string;
  deleteItem: string;
  quickAddStock: string;
  paymentMode: string;
  customerName: string;
  customerPhone: string;
  invoice: string;
  printBill: string;
  shareWhatsApp: string;
  paid: string;
  due: string;
  partial: string;
  addSale: string;
  exportData: string;
  importData: string;
  lowStockAlert: string;
  inStock: string;
  outOfStock: string;
}

export const translations: Record<'en' | 'hi', Translations> = {
  en: {
    appTitle: 'Mobile Shop Manager',
    appSubtitle: 'Display Folders, Keypad Mobiles & Accessories Stock & Sales',
    allStock: 'All Stock (सब सामान)',
    displaysTab: '📱 Mobile Displays (फोल्डर)',
    keypadTab: '📟 Keypad Mobiles (कीपैड)',
    accessoriesTab: '🎧 Accessories (एक्सेसरीज)',
    salesBilling: 'POS Bill (सेल बिलिंग)',
    salesHistory: 'Sales History (बिक्री रिपोर्ट)',
    dueKhata: 'Customer Khata / Due (उधारी)',
    priceQuoter: 'Quick Rate Quoter (रेट चेकर)',
    settings: 'Shop Settings',
    newItem: '+ Add New Item',
    newSale: '+ New Sale Bill',
    searchPlaceholder: 'Search by model (e.g. Y20, M31, Note 10), brand, rack...',
    totalStockValue: 'Total Stock Worth',
    purchaseValue: 'Khareed (Cost)',
    sellingValue: 'Bikri (Retail)',
    totalProducts: 'Total Items in Shop',
    lowStockItems: 'Low Stock Alert',
    todaySales: "Today's Sales",
    todayProfit: "Today's Estimated Profit",
    costPrice: 'Purchase Rate (खरीद)',
    sellPrice: 'Selling Rate (बिक्री)',
    wholesalePrice: 'Wholesale Rate (थोक)',
    fittingCharge: 'Fitting / Labour (फिटिंग)',
    stockQty: 'Stock Quantity (मात्रा)',
    profitMargin: 'Profit Margin',
    rackLocation: 'Box / Drawer Location',
    quality: 'Display Grade / Quality',
    category: 'Category',
    brand: 'Brand / Company',
    model: 'Model Name',
    actions: 'Actions',
    saveItem: 'Save Item',
    editItem: 'Edit Item',
    deleteItem: 'Delete Item',
    quickAddStock: 'Quick Stock +/-',
    paymentMode: 'Payment Mode',
    customerName: 'Customer Name',
    customerPhone: 'Mobile Number',
    invoice: 'Invoice Bill',
    printBill: 'Print Receipt',
    shareWhatsApp: 'Share on WhatsApp',
    paid: 'Paid (पूरा भुगतान)',
    due: 'Full Due (उधारी)',
    partial: 'Partial Paid (आधा भुगतान)',
    addSale: 'Complete Sale',
    exportData: 'Export Backup (JSON/Excel)',
    importData: 'Restore Backup',
    lowStockAlert: 'Low Stock!',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
  },
  hi: {
    appTitle: 'मोबाइल स्टॉक एवं बिलिंग मैनेजर',
    appSubtitle: 'डिस्प्ले फोल्डर, कीपैड मोबाइल एवं एक्सेसरीज इन्वेंट्री ट्रैकर',
    allStock: 'सभी सामान (All Stock)',
    displaysTab: '📱 मोबाइल डिस्प्ले / फोल्डर',
    keypadTab: '📟 कीपैड मोबाइल फोन',
    accessoriesTab: '🎧 मोबाइल एक्सेसरीज व सामान',
    salesBilling: 'नया बिल / बिक्री (POS)',
    salesHistory: 'बिक्री इतिहास (Sales History)',
    dueKhata: 'ग्राहक खाता / उधारी (Due Khata)',
    priceQuoter: 'रेट चेकर (Price Quoter)',
    settings: 'दुकान सेटिंग (Shop Setup)',
    newItem: '+ नया सामान जोड़ें',
    newSale: '+ नया बिल बनाएं',
    searchPlaceholder: 'मॉडल खोजें (उदा. Y20, Note 10, 105, चार्जर, बैक कवर)...',
    totalStockValue: 'कुल स्टॉक वैल्यू',
    purchaseValue: 'खरीद मूल्य (Cost)',
    sellingValue: 'बिक्री मूल्य (Retail)',
    totalProducts: 'कुल उपलब्ध सामान',
    lowStockItems: 'कम स्टॉक अलर्ट (Low Stock)',
    todaySales: 'आज की कुल बिक्री',
    todayProfit: 'आज का अनुमानित मुनाफा',
    costPrice: 'खरीद रेट (Cost Price)',
    sellPrice: 'बिक्री रेट (Selling Price)',
    wholesalePrice: 'होलसेल रेट (Wholesale)',
    fittingCharge: 'फिटिंग / मजदूरी चार्ज',
    stockQty: 'उपलब्ध स्टॉक (Pcs)',
    profitMargin: 'मुनाफा मार्जिन (%)',
    rackLocation: 'दुकान में बॉक्स / रैक जगह',
    quality: 'डिस्प्ले क्वालिटी (Grade)',
    category: 'कैटेगरी',
    brand: 'कंपनी / ब्रांड',
    model: 'मॉडल का नाम',
    actions: 'क्रियाएँ',
    saveItem: 'सामान सेव करें',
    editItem: 'बदलाव करें',
    deleteItem: 'हटाएं',
    quickAddStock: 'स्टॉक घटाएं/बढ़ाएं',
    paymentMode: 'भुगतान का तरीका',
    customerName: 'ग्राहक का नाम',
    customerPhone: 'ग्राहक का फोन नंबर',
    invoice: 'दुकान रसीद / बिल',
    printBill: 'बिल प्रिंट करें',
    shareWhatsApp: 'व्हाट्सएप पर रसीद भेजें',
    paid: 'पूरा पेमेंट मिला',
    due: 'बाकी / उधारी',
    partial: 'कुछ पेमेंट मिला',
    addSale: 'बिक्री दर्ज करें',
    exportData: 'बैकअप डाउनलोड करें',
    importData: 'बैकअप रीस्टोर करें',
    lowStockAlert: 'स्टॉक कम है!',
    inStock: 'स्टॉक में है',
    outOfStock: 'स्टॉक खत्म',
  },
};
