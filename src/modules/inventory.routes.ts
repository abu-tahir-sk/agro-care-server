import { Router, Request, Response } from 'express';

const router = Router();

// Mock Warehouse Batches (FEFO Tracking)
const mockBatches = [
  {
    batchNumber: 'IFF-2026-B89',
    productId: 'prod-01',
    productName: 'ইফকো ডিএপি সার ১৮:৪৬:০ (৫০ কেজি)',
    warehouse: 'Kolkata Central Hub',
    quantity: 450,
    mfgDate: '2024-01-15',
    expiryDate: '2026-12-15',
    daysToExpiry: 42,
    status: 'FEFO_PRIORITY',
    recommendedAction: 'Dispatch with priority (First Expiry)',
  },
  {
    batchNumber: 'BYR-CF-901',
    productId: 'prod-03',
    productName: 'বায়ার কনফিডোর ২৫০ মিলি',
    warehouse: 'Burdwan Depot',
    quantity: 120,
    mfgDate: '2024-06-10',
    expiryDate: '2027-01-20',
    daysToExpiry: 78,
    status: 'NORMAL',
    recommendedAction: 'Regular sales rotation',
  },
  {
    batchNumber: 'WB-SEED-8902',
    productId: 'prod-02',
    productName: 'স্বর্ণা-সাব১ ধানের বীজ (১০ কেজি)',
    warehouse: 'Nadia Agri Distribution Center',
    quantity: 320,
    mfgDate: '2025-05-01',
    expiryDate: '2027-06-30',
    daysToExpiry: 238,
    status: 'NORMAL',
    recommendedAction: 'Regular sales rotation',
  },
];

// GET /api/v1/inventory/batches - List FEFO stock batches
router.get('/batches', (req: Request, res: Response) => {
  // Sort by expiry date ascending for FEFO
  const sorted = [...mockBatches].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return res.status(200).json({
    success: true,
    totalBatches: sorted.length,
    fefoPrioritiesCount: sorted.filter((b) => b.status === 'FEFO_PRIORITY').length,
    data: sorted,
  });
});

// GET /api/v1/inventory/alerts - Low stock & expiry warnings
router.get('/alerts', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    alerts: [
      {
        type: 'EXPIRY_WARNING',
        batchNumber: 'IFF-2026-B89',
        product: 'ইফকো ডিএপি সার ১৮:৪৬:০',
        expiryDate: '2026-12-15',
        severity: 'HIGH',
        message: 'ব্যাচের মেয়াদ আর মাত্র ৪২ দিন বাকি। দ্রুত সরবরাহ করুন।',
      },
      {
        type: 'LOW_STOCK',
        product: 'বায়ার কনফিডোর ২৫০ মিলি',
        currentStock: 120,
        threshold: 200,
        severity: 'MEDIUM',
        message: 'বর্ধমান ডিপোতে স্টক ২০০ ইউনিটের নিচে নেমে গেছে।',
      },
    ],
  });
});

export default router;

