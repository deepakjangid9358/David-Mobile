export type ItemCategory = 'display' | 'keypad' | 'accessory';

export type DisplayQuality =
  | 'Original'
  | 'OLED'
  | 'Crown'
  | 'Diamond'
  | 'GX'
  | 'OGS'
  | 'INCELL'
  | '1st Copy'
  | '9D'
  | 'TFT'
  | 'Other';

export type AccessorySubCategory =
  | 'Charger & Adapter'
  | 'Data Cable'
  | 'Earphone / TWS / Neckband'
  | 'Tempered Glass / UV'
  | 'Back Cover / Skin'
  | 'Power Bank'
  | 'Battery'
  | 'OTG & Connectors'
  | 'Memory Card & Pen Drive'
  | 'Speaker'
  | 'Mobile Stand / Holder'
  | 'Other Accessory';

export interface StockItem {
  id: string;
  category: ItemCategory;
  brand: string; // e.g., Samsung, Vivo, Oppo, Realme, Redmi, Apple, Itel, boAt
  modelName: string; // e.g., M31, Y20, Note 10 Pro, 105, Airdopes 141
  qualityGrade?: DisplayQuality | string; // For displays
  subCategory?: AccessorySubCategory | string; // For accessories
  color?: string; // For keypad & accessories
  purchasePrice: number; // खरीद रेट (Cost Price)
  sellingPrice: number; // बिक्री रेट (Selling Price / Retail)
  wholesalePrice?: number; // होलसेल रेट (Wholesale / Dealer)
  fittingCharge?: number; // फिटिंग चार्ज (Labour / Fitting)
  quantity: number; // Current Stock
  minStockAlert: number; // Minimum stock notification threshold
  locationRack?: string; // Box/Rack/Drawer e.g., 'Box D-12'
  imeiNumbers?: string[]; // Optional for keypad phones
  warrantyDays?: number; // Warranty in days
  barcode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  itemId: string;
  stockItemId?: string;
  itemName: string;
  category: ItemCategory;
  brand?: string;
  qualityGrade?: string;
  purchasePrice?: number;
  costPrice?: number;
  unitPrice: number; // selling price
  fittingCharge?: number;
  quantity: number;
  totalPrice?: number;
  total?: number;
  profit?: number;
}

export type PaymentMode = 'cash' | 'upi' | 'credit' | 'card';
export type PaymentStatus = 'paid' | 'partial' | 'due';

export interface SaleTransaction {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal?: number;
  fittingTotal?: number;
  discount?: number;
  totalAmount: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  dueAmount: number;
  warrantyDays?: number;
  notes?: string;
}

export interface ShopProfile {
  shopName: string;
  ownerName: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  gstin?: string;
  upiId?: string; // For generating UPI QR on bills
  tagline?: string;
  invoiceFooterMessage?: string;
}

export interface DueRecord {
  customerName: string;
  customerPhone: string;
  totalDue: number;
  lastTransactionDate: string;
  transactions: SaleTransaction[];
}
