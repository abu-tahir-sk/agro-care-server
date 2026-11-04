import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/v1/analytics/kpi - Central Enterprise Control KPI
router.get('/kpi', (req: Request, res: Response) => {
  // Strict segregation as per Master Documentation Section 9.1 & 17
  const financialSummary = {
    grossRevenue: 4260000, // Total turnover ₹42.60 Lakh
    costOfGoodsSold: 3575000, // Cost of goods sold (Wholesale / Supplier purchase)
    grossProfit: 685000, // Gross Profit ₹6.85 Lakh (16.1%)
    operatingExpenses: 265000, // Delivery logistics, warehousing, server hosting, customer support
    netProfit: 420000, // Net Profit ₹4.20 Lakh (9.8%)
    netMarginPercent: 9.8,
  };

  const volumeMetrics = {
    totalOrders: 1840,
    pendingDeliveries: 48,
    activeFarmers: 12450,
    verifiedRetailers: 320,
    activeSuppliers: 42,
    totalCatalogProducts: 186,
    expiringBatchesCount: 6,
    pendingLicensesCount: 8,
  };

  const channelDistribution = {
    farmerRetailSales: 1820000, // 42.7%
    retailerWholesaleSales: 2440000, // 57.3%
  };

  return res.status(200).json({
    success: true,
    data: {
      financials: financialSummary,
      volumes: volumeMetrics,
      channels: channelDistribution,
      lastUpdated: new Date().toISOString(),
    },
  });
});

export default router;

