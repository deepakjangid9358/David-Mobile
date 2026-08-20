import { StockItem, SaleTransaction, ShopProfile } from '../types';

const STORAGE_KEYS = {
  ITEMS: 'mobileshop_inventory_items_v2',
  SALES: 'mobileshop_sales_history_v2',
  PROFILE: 'mobileshop_shop_profile_v2',
  LANG: 'mobileshop_ui_language',
};

export const DEFAULT_SHOP_PROFILE: ShopProfile = {
  shopName: 'David Mobile',
  ownerName: 'David',
  phone: '9053540404',
  alternatePhone: '',
  address: 'Shop No 7 Near HDFC Bank, Bawal Road',
  city: 'Karnawas',
  gstin: '',
  upiId: '9053540404@upi',
  tagline: 'Mobile Display Combo, Keypad Phones & Accessories Specialist',
  invoiceFooterMessage: 'Thank you for visiting David Mobile! 30-Day Testing Warranty on Combos with intact stamp.',
};

export const COMMON_BRANDS = [
  'Samsung',
  'Vivo',
  'Oppo',
  'Realme',
  'Redmi / Xiaomi',
  'OnePlus',
  'Apple iPhone',
  'Motorola',
  'Poco',
  'Infinix',
  'Tecno',
  'Nokia',
  'Itel',
  'Lava',
  'Jio',
  'boAt',
  'Noise',
  'Boult',
  'Fire-Boltt',
  'Portronics',
  'Ubon',
  'Other',
];

export const KEYPAD_BRANDS = [
  'Itel',
  'Nokia',
  'Lava',
  'Samsung',
  'Micromax',
  'JioPhone',
  'Karbonn',
  'Snexian',
  'I Kall',
  'Other',
];

export const ACCESSORY_TYPES = [
  'Fast Charger (18W/33W/67W/120W)',
  'Type-C Data Cable',
  'Micro USB Cable',
  'iPhone Lightning Cable',
  'Tempered Glass (11D/UV/Privacy)',
  'Back Cover (Smoke/Silicone/Leather)',
  'Neckband Bluetooth Earphone',
  'TWS Earbuds',
  'Wired 3.5mm Earphone',
  'Mobile Battery',
  'Power Bank (10000mAh/20000mAh)',
  'OTG Connector / Adapter',
  'Memory Card (32GB/64GB/128GB)',
  'Mobile Stand / Car Holder',
  'Speaker Bluetooth',
  'Other Accessory',
];

export const DISPLAY_QUALITIES = [
  { label: 'Original (100% OEM)', desc: 'Full Brightness, OLED/AMOLED, Touch 100%', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { label: 'Crown', desc: 'Premium Aftermarket Crown Grade', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  { label: 'Meetoo', desc: 'Meetoo Display Quality', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { label: 'Moxie', desc: 'Moxie Display Quality', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
  { label: 'Raj', desc: 'Raj Grade Combo', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { label: 'Wd', desc: 'WD Grade Quality', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { label: 'Crown / Diamond', desc: 'Premium Aftermarket, Vivid Colors', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300' },
  { label: 'OLED', desc: 'High Brightness OLED Screen', badgeColor: 'bg-pink-100 text-pink-800 border-pink-300' },
  { label: 'INCELL', desc: 'Balanced Quality, Fast Response', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  { label: 'OG (First Copy)', desc: 'First Copy Replacement', badgeColor: 'bg-violet-100 text-violet-800 border-violet-300' },
  { label: 'TFT / Normal', desc: 'Budget Friendly Option', badgeColor: 'bg-gray-100 text-gray-800 border-gray-300' },
];

export const SAMPLE_INITIAL_ITEMS: StockItem[] = [
  {
    id: "item_1787149561165_jrjug",
    category: "display",
    brand: "Vivo",
    modelName: "V30",
    qualityGrade: "Original (100% OEM)",
    purchasePrice: 2000,
    sellingPrice: 2500,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:26:01.165Z",
    updatedAt: "2026-08-19T14:26:01.165Z"
  },
  {
    id: "item_1787149529349_irdxl",
    category: "display",
    brand: "Vivo",
    modelName: "V27",
    qualityGrade: "Original (100% OEM)",
    purchasePrice: 2000,
    sellingPrice: 2500,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:25:29.349Z",
    updatedAt: "2026-08-19T14:25:29.349Z"
  },
  {
    id: "item_1787149508611_e4ryk",
    category: "display",
    brand: "Vivo",
    modelName: "V40e",
    qualityGrade: "Original (100% OEM)",
    purchasePrice: 2000,
    sellingPrice: 2600,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:25:08.611Z",
    updatedAt: "2026-08-19T14:25:08.611Z"
  },
  {
    id: "item_1787149456072_lndev",
    category: "display",
    brand: "Motorola",
    modelName: "G85",
    qualityGrade: "Original",
    purchasePrice: 2000,
    sellingPrice: 2700,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:24:16.072Z",
    updatedAt: "2026-08-19T14:24:16.072Z"
  },
  {
    id: "item_1787149401187_vswkw",
    category: "display",
    brand: "Samsung",
    modelName: "A16",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    fittingCharge: 150,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:23:21.191Z",
    updatedAt: "2026-08-19T14:23:21.191Z"
  },
  {
    id: "item_1787149370348_1n0r9",
    category: "display",
    brand: "Samsung",
    modelName: "A14 5g",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:22:50.348Z",
    updatedAt: "2026-08-19T14:22:50.348Z"
  },
  {
    id: "item_1787149306554_q4gq0",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "9 prime",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:21:46.554Z",
    updatedAt: "2026-08-19T14:21:46.554Z"
  },
  {
    id: "item_1787149283408_v25xx",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Note 13",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:21:23.410Z",
    updatedAt: "2026-08-19T14:21:23.410Z"
  },
  {
    id: "item_1787149263138_jqz1d",
    category: "display",
    brand: "Samsung",
    modelName: "M32",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:21:03.139Z",
    updatedAt: "2026-08-19T14:21:03.139Z"
  },
  {
    id: "item_1787149180068_vn97i",
    category: "display",
    brand: "Samsung",
    modelName: "A12",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:19:40.068Z",
    updatedAt: "2026-08-19T14:19:40.069Z"
  },
  {
    id: "item_1787149115769_iwhvy",
    category: "display",
    brand: "Vivo",
    modelName: "Y51 pro",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:18:35.769Z",
    updatedAt: "2026-08-19T14:18:35.769Z"
  },
  {
    id: "item_1787149091717_m6fuw",
    category: "display",
    brand: "Realme",
    modelName: "X",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:18:11.717Z",
    updatedAt: "2026-08-19T14:18:11.717Z"
  },
  {
    id: "item_1787149065435_n5x08",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Note 9 pro",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:17:45.438Z",
    updatedAt: "2026-08-19T14:17:45.440Z"
  },
  {
    id: "item_1787149023941_t56kk",
    category: "display",
    brand: "Oppo",
    modelName: "F11",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:17:03.941Z",
    updatedAt: "2026-08-19T14:17:03.941Z"
  },
  {
    id: "item_1787149003115_0fqqn",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "10 prime",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:16:43.115Z",
    updatedAt: "2026-08-19T14:16:43.115Z"
  },
  {
    id: "item_1787148976622_3qkp4",
    category: "display",
    brand: "Samsung",
    modelName: "A35",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:16:16.622Z",
    updatedAt: "2026-08-19T14:16:16.622Z"
  },
  {
    id: "item_1787148947157_cv5o1",
    category: "display",
    brand: "Samsung",
    modelName: "M55",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:15:47.157Z",
    updatedAt: "2026-08-19T14:15:47.157Z"
  },
  {
    id: "item_1787148917099_wwa0j",
    category: "display",
    brand: "Samsung",
    modelName: "M55",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:15:17.108Z",
    updatedAt: "2026-08-19T14:15:17.109Z"
  },
  {
    id: "item_1787148856177_sj2qn",
    category: "display",
    brand: "Samsung",
    modelName: "A53",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:14:16.177Z",
    updatedAt: "2026-08-19T14:14:16.177Z"
  },
  {
    id: "item_1787148839036_g2hea",
    category: "display",
    brand: "Infinix",
    modelName: "Hot 50",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:13:59.036Z",
    updatedAt: "2026-08-19T14:13:59.036Z"
  },
  {
    id: "item_1787148763836_utl39",
    category: "display",
    brand: "Samsung",
    modelName: "A04e",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:12:43.836Z",
    updatedAt: "2026-08-19T14:12:43.836Z"
  },
  {
    id: "item_1787148740865_ysgaa",
    category: "display",
    brand: "Infinix",
    modelName: "KG 6",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:12:20.865Z",
    updatedAt: "2026-08-19T14:12:20.865Z"
  },
  {
    id: "item_1787148701261_9jqc8",
    category: "display",
    brand: "Vivo",
    modelName: "V20",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:11:41.261Z",
    updatedAt: "2026-08-19T14:11:41.261Z"
  },
  {
    id: "item_1787148653158_40p91",
    category: "display",
    brand: "Vivo",
    modelName: "T1 pro",
    qualityGrade: "Meetoo",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:10:53.158Z",
    updatedAt: "2026-08-19T14:10:53.158Z"
  },
  {
    id: "item_1787148629215_hiixj",
    category: "display",
    brand: "Vivo",
    modelName: "Y36",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:10:29.216Z",
    updatedAt: "2026-08-19T14:10:29.222Z"
  },
  {
    id: "item_1787148327697_hfaql",
    category: "display",
    brand: "OnePlus",
    modelName: "Ce 3",
    qualityGrade: "Moxie",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:05:27.697Z",
    updatedAt: "2026-08-19T14:05:27.697Z"
  },
  {
    id: "item_1787148297454_ytvk4",
    category: "display",
    brand: "Lava",
    modelName: "Z3",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:04:57.454Z",
    updatedAt: "2026-08-19T14:04:57.454Z"
  },
  {
    id: "item_1787148259882_73ort",
    category: "display",
    brand: "Infinix",
    modelName: "Hot 8",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:04:19.882Z",
    updatedAt: "2026-08-19T14:04:19.882Z"
  },
  {
    id: "item_1787148134900_5h2x9",
    category: "display",
    brand: "Realme",
    modelName: "P4x",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:02:14.900Z",
    updatedAt: "2026-08-19T14:02:14.900Z"
  },
  {
    id: "item_1787148087937_z3sh4",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Note 10 pro",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:01:27.939Z",
    updatedAt: "2026-08-19T14:01:27.939Z"
  },
  {
    id: "item_1787148039985_gr1nr",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Mi 7 / y3",
    qualityGrade: "Raj",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T14:00:39.985Z",
    updatedAt: "2026-08-19T14:00:39.985Z"
  },
  {
    id: "item_1787147972362_06gm5",
    category: "display",
    brand: "Samsung",
    modelName: "A71",
    qualityGrade: "Raj",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:59:32.362Z",
    updatedAt: "2026-08-19T13:59:32.362Z"
  },
  {
    id: "item_1787147917831_ssz3b",
    category: "display",
    brand: "Tecno",
    modelName: "Kg 5",
    qualityGrade: "Wd",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:58:37.831Z",
    updatedAt: "2026-08-19T13:58:37.831Z"
  },
  {
    id: "item_1787147232945_c878v",
    category: "display",
    brand: "Infinix",
    modelName: "Hot 10 play",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:47:12.945Z",
    updatedAt: "2026-08-19T13:47:12.945Z"
  },
  {
    id: "item_1787147187964_nnwfp",
    category: "display",
    brand: "OnePlus",
    modelName: "Nord 2",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:46:27.964Z",
    updatedAt: "2026-08-19T13:46:27.964Z"
  },
  {
    id: "item_1787147157426_k99r1",
    category: "display",
    brand: "Samsung",
    modelName: "A52",
    qualityGrade: "",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:45:57.426Z",
    updatedAt: "2026-08-19T13:45:57.426Z"
  },
  {
    id: "item_1787147131657_cr76c",
    category: "display",
    brand: "Realme",
    modelName: "C20",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:45:31.657Z",
    updatedAt: "2026-08-19T13:45:31.657Z"
  },
  {
    id: "item_1787147111458_lxwhe",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Note 11",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:45:11.458Z",
    updatedAt: "2026-08-19T13:45:11.458Z"
  },
  {
    id: "item_1787147078612_wgyzf",
    category: "display",
    brand: "Vivo",
    modelName: "V23 5g",
    qualityGrade: "Meetoo",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:44:38.612Z",
    updatedAt: "2026-08-19T13:44:38.612Z"
  },
  {
    id: "item_1787147033948_ki7mh",
    category: "display",
    brand: "OnePlus",
    modelName: "9R",
    qualityGrade: "Moxie",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:43:53.953Z",
    updatedAt: "2026-08-19T13:43:53.956Z"
  },
  {
    id: "item_1787147002776_pccre",
    category: "display",
    brand: "Infinix",
    modelName: "Hot 12",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:43:22.779Z",
    updatedAt: "2026-08-19T13:43:22.785Z"
  },
  {
    id: "item_1787145422784_9amhe",
    category: "display",
    brand: "Samsung",
    modelName: "A24",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:17:02.784Z",
    updatedAt: "2026-08-19T13:17:02.784Z"
  },
  {
    id: "item_1787145391925_ewyks",
    category: "display",
    brand: "Poco",
    modelName: "X3 pro",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:16:31.925Z",
    updatedAt: "2026-08-19T13:16:31.925Z"
  },
  {
    id: "item_1787145356777_orb1c",
    category: "display",
    brand: "Samsung",
    modelName: "M34",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:15:56.777Z",
    updatedAt: "2026-08-19T13:15:56.777Z"
  },
  {
    id: "item_1787145331232_9b1dq",
    category: "display",
    brand: "Samsung",
    modelName: "A01",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    fittingCharge: 1,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:15:31.232Z",
    updatedAt: "2026-08-19T13:15:31.232Z"
  },
  {
    id: "item_1787145240659_ejo6e",
    category: "display",
    brand: "Infinix",
    modelName: "Hot 9",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    wholesalePrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:14:00.659Z",
    updatedAt: "2026-08-19T13:14:00.659Z"
  },
  {
    id: "item_1787145216776_8zc21",
    category: "display",
    brand: "Samsung",
    modelName: "A10",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:13:36.776Z",
    updatedAt: "2026-08-19T13:13:36.776Z"
  },
  {
    id: "item_1787145197559_k4oa1",
    category: "display",
    brand: "Samsung",
    modelName: "A01 core",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:13:17.559Z",
    updatedAt: "2026-08-19T13:13:17.559Z"
  },
  {
    id: "item_1787145134147_x7i10",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Note 12 pro",
    qualityGrade: "Moxie",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:12:14.149Z",
    updatedAt: "2026-08-19T13:12:14.149Z"
  },
  {
    id: "item_1787145107101_772pi",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Note 13",
    qualityGrade: "Moxie",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    warrantyDays: 3,
    createdAt: "2026-08-19T13:11:47.105Z",
    updatedAt: "2026-08-19T13:11:47.105Z"
  },
  {
    id: "item_1787144429166_3yfcm",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "Note 12",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T13:00:29.166Z",
    updatedAt: "2026-08-19T13:00:29.167Z"
  },
  {
    id: "item_1787144256930_n0hss",
    category: "display",
    brand: "Samsung",
    modelName: "A13 4g",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    fittingCharge: 150,
    quantity: 4,
    minStockAlert: 2,
    locationRack: "Box D-01",
    warrantyDays: 30,
    createdAt: "2026-08-19T12:57:36.930Z",
    updatedAt: "2026-08-19T14:20:15.328Z"
  },
  {
    id: "item_1787144202947_7i5mg",
    category: "display",
    brand: "Samsung",
    modelName: "A20",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:56:42.947Z",
    updatedAt: "2026-08-19T12:56:42.949Z"
  },
  {
    id: "item_1787143826649_6r12j",
    category: "display",
    brand: "Samsung",
    modelName: "A70",
    qualityGrade: "INCELL",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:50:26.650Z",
    updatedAt: "2026-08-19T12:50:26.650Z"
  },
  {
    id: "item_1787143662993_hbouy",
    category: "display",
    brand: "Samsung",
    modelName: "M52",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    fittingCharge: 150,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:47:42.993Z",
    updatedAt: "2026-08-19T12:47:42.993Z"
  },
  {
    id: "item_1787143643452_htvj1",
    category: "display",
    brand: "Samsung",
    modelName: "M11",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:47:23.452Z",
    updatedAt: "2026-08-19T12:47:23.452Z"
  },
  {
    id: "item_1787143564799_bkx7k",
    category: "display",
    brand: "Samsung",
    modelName: "A51",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 1,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:46:04.799Z",
    updatedAt: "2026-08-19T12:46:04.799Z"
  },
  {
    id: "item_1787143534186_n2try",
    category: "display",
    brand: "Samsung",
    modelName: "A05s",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    fittingCharge: 150,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:45:34.186Z",
    updatedAt: "2026-08-19T12:45:34.186Z"
  },
  {
    id: "item_1787143507094_bo290",
    category: "display",
    brand: "Vivo",
    modelName: "Y100",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:45:07.094Z",
    updatedAt: "2026-08-19T12:45:07.094Z"
  },
  {
    id: "item_1787143418342_j90ig",
    category: "display",
    brand: "Vivo",
    modelName: "S1",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:43:38.342Z",
    updatedAt: "2026-08-19T12:43:38.342Z"
  },
  {
    id: "item_1787143372333_aem2z",
    category: "display",
    brand: "Vivo",
    modelName: "Y02",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:42:52.337Z",
    updatedAt: "2026-08-19T12:42:52.337Z"
  },
  {
    id: "item_1787143289559_18a05",
    category: "display",
    brand: "Oppo",
    modelName: "A3S",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 600,
    quantity: 2,
    minStockAlert: 1,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:41:29.559Z",
    updatedAt: "2026-08-19T12:41:29.559Z"
  },
  {
    id: "item_1787143251167_uledx",
    category: "display",
    brand: "Motorola",
    modelName: "G60",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 600,
    quantity: 2,
    minStockAlert: 1,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:40:51.167Z",
    updatedAt: "2026-08-19T12:40:51.167Z"
  },
  {
    id: "item_1787143201433_qr4me",
    category: "display",
    brand: "Redmi / Xiaomi",
    modelName: "A78 Pro / 15A",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 600,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:40:01.433Z",
    updatedAt: "2026-08-19T12:40:01.433Z"
  },
  {
    id: "item_1787143118137_l9xl6",
    category: "display",
    brand: "Motorola",
    modelName: "G20",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 600,
    quantity: 2,
    minStockAlert: 1,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:38:38.138Z",
    updatedAt: "2026-08-19T12:38:38.143Z"
  },
  {
    id: "item_1787142894543_prnr8",
    category: "display",
    brand: "Infinix",
    modelName: "Hot 9 play",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:34:54.543Z",
    updatedAt: "2026-08-19T12:34:54.547Z"
  },
  {
    id: "item_1787142802136_ywu0r",
    category: "display",
    brand: "Tecno",
    modelName: "Kg 5k",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:33:22.136Z",
    updatedAt: "2026-08-19T12:33:22.137Z"
  },
  {
    id: "item_1787142770631_p9wcc",
    category: "display",
    brand: "Motorola",
    modelName: "G45",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 2,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:32:50.631Z",
    updatedAt: "2026-08-19T12:32:50.631Z"
  },
  {
    id: "item_1787142733163_p2cyt",
    category: "display",
    brand: "Tecno",
    modelName: "spark 5 air",
    qualityGrade: "Crown",
    purchasePrice: 500,
    sellingPrice: 650,
    quantity: 2,
    minStockAlert: 1,
    locationRack: "Box D-01",
    createdAt: "2026-08-19T12:32:13.164Z",
    updatedAt: "2026-08-19T12:32:13.167Z"
  }
];

export const SAMPLE_INITIAL_SALES: SaleTransaction[] = [];

export const ACCESSORY_CATEGORIES = [
  'Tempered Glass / Screen Guard',
  'Back Cover & Cases',
  'Fast Charger & Adapter',
  'Charging Cable (Type-C, Micro, iPhone)',
  'Earphones & Neckbands',
  'TWS Earbuds / Airpods',
  'Power Bank',
  'OTG & Card Reader',
  'Mobile Battery',
  'Folder Glue & Repair Tools',
  'Memory Card & Pendrive',
  'Speaker & Bluetooth Gadgets',
  'Other Spare Parts',
];

export const POPULAR_BRANDS = [
  'Samsung',
  'Vivo',
  'Oppo',
  'Realme',
  'Redmi / Xiaomi',
  'OnePlus',
  'Motorola',
  'Infinix',
  'Tecno',
  'Poco',
  'Apple iPhone',
  'Lava',
  'Itel',
  'Nokia',
  'Jio',
  'Micromax',
  'Boat',
  'Noise',
  'Boult',
  'Portronics',
  'Generic / Other',
];

// Helper functions for LocalStorage persistence
export function getSavedStock(): StockItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(SAMPLE_INITIAL_ITEMS));
      return SAMPLE_INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_INITIAL_ITEMS;
  }
}

export function saveStock(items: StockItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving stock items:', err);
  }
}

export function getSavedSales(): SaleTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(SAMPLE_INITIAL_SALES));
      return SAMPLE_INITIAL_SALES;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_INITIAL_SALES;
  }
}

export function saveSales(sales: SaleTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch (err) {
    console.error('Error saving sales history:', err);
  }
}

export function getShopProfile(): ShopProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_SHOP_PROFILE));
      return DEFAULT_SHOP_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SHOP_PROFILE;
  }
}

export function saveShopProfile(profile: ShopProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving shop profile:', err);
  }
}

export function getLanguagePreference(): 'en' | 'hi' {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LANG);
    return raw === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguagePreference(lang: 'en' | 'hi'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  } catch (err) {
    console.error('Error saving language preference:', err);
  }
}
