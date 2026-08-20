import { StockItem, SaleTransaction, ShopProfile } from '../types';

/**
 * Exports current stock items to an Excel-compatible CSV with UTF-8 BOM for perfect Indian rupee and multilingual rendering.
 */
export function exportStockToExcel(items: StockItem[], shopName = 'Mobile Shop'): void {
  const headers = [
    'Category',
    'Brand',
    'Model Name',
    'Quality / Grade / SubCategory',
    'Color',
    'Purchase Cost (₹)',
    'Selling Rate (₹)',
    'Fitting Charge (₹)',
    'Total Customer Price (₹)',
    'Profit Margin / Unit (₹)',
    'Current Stock (Qty)',
    'Stock Status',
    'Stock Value Cost (₹)',
    'Stock Value Retail (₹)',
    'Rack / Drawer Location',
    'Warranty (Days)',
    'Notes / Remarks',
  ];

  const rows = items.map((item) => {
    const totalCustomerPrice = item.sellingPrice + (item.fittingCharge || 0);
    const unitProfit = totalCustomerPrice - item.purchasePrice;
    const stockStatus =
      item.quantity === 0
        ? 'Out of Stock'
        : item.quantity <= item.minStockAlert
        ? 'Low Stock Alert'
        : 'In Stock';
    const totalCostValue = item.purchasePrice * item.quantity;
    const totalRetailValue = totalCustomerPrice * item.quantity;

    const categoryLabel =
      item.category === 'display'
        ? 'Mobile Display (Combo Folder)'
        : item.category === 'keypad'
        ? 'Keypad Mobile Phone'
        : 'Mobile Accessory';

    return [
      `"${categoryLabel}"`,
      `"${(item.brand || '').replace(/"/g, '""')}"`,
      `"${(item.modelName || '').replace(/"/g, '""')}"`,
      `"${(item.qualityGrade || item.subCategory || '').replace(/"/g, '""')}"`,
      `"${(item.color || '').replace(/"/g, '""')}"`,
      item.purchasePrice,
      item.sellingPrice,
      item.fittingCharge || 0,
      totalCustomerPrice,
      unitProfit,
      item.quantity,
      `"${stockStatus}"`,
      totalCostValue,
      totalRetailValue,
      `"${(item.locationRack || '').replace(/"/g, '""')}"`,
      item.warrantyDays || '',
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanShopName = shopName.replace(/[^a-zA-Z0-9_-]/g, '_');

  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `${cleanShopName}_Stock_Inventory_${dateStr}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports sales transactions to Excel-compatible CSV
 */
export function exportSalesToExcel(sales: SaleTransaction[], shopName = 'Mobile Shop'): void {
  const headers = [
    'Invoice No',
    'Date & Time',
    'Customer Name',
    'Phone',
    'Items Summary',
    'Total Items (Qty)',
    'Subtotal (₹)',
    'Fitting Charge (₹)',
    'Discount (₹)',
    'Grand Total (₹)',
    'Paid Amount (₹)',
    'Due Amount (₹)',
    'Payment Mode',
    'Payment Status',
    'Notes',
  ];

  const rows = sales.map((sale) => {
    const itemsSummary = sale.items
      .map((it) => `${it.itemName} (${it.quantity}x @₹${it.unitPrice})`)
      .join('; ');
    const totalQty = sale.items.reduce((sum, it) => sum + it.quantity, 0);

    return [
      `"${sale.invoiceNumber}"`,
      `"${new Date(sale.date).toLocaleString('en-IN')}"`,
      `"${(sale.customerName || '').replace(/"/g, '""')}"`,
      `"${(sale.customerPhone || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      totalQty,
      sale.subtotal || sale.totalAmount,
      sale.fittingTotal || 0,
      sale.discount || 0,
      sale.totalAmount,
      sale.paidAmount,
      sale.dueAmount || 0,
      `"${sale.paymentMode.toUpperCase()}"`,
      `"${sale.paymentStatus.toUpperCase()}"`,
      `"${(sale.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanShopName = shopName.replace(/[^a-zA-Z0-9_-]/g, '_');

  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', `${cleanShopName}_Sales_Report_${dateStr}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
}
