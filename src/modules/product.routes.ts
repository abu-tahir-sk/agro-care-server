import { Router, Request, Response } from 'express';

const router = Router();

// Mock verified products database
const mockProducts = [
  {
    id: 'prod-01',
    slug: 'iffco-dap-fertilizer',
    nameEn: 'IFFCO DAP (Di-Ammonium Phosphate) 18:46:0',
    nameBn: 'ইফকো ডিএপি (ডাই-অ্যামোনিয়াম ফসফেট) ১৮:৪৬:০',
    brand: 'IFFCO',
    category: 'Fertilizers',
    categoryBn: 'রাসায়নিক ও সার',
    sellingPrice: 1350,
    retailerPrice: 1220,
    moq: 10,
    tierPricing: [
      { minQty: 1, pricePerUnit: 1350 },
      { minQty: 10, pricePerUnit: 1220 },
      { minQty: 50, pricePerUnit: 1180 },
    ],
    batchNumber: 'IFF-2026-B89',
    expiryDate: '2028-12-31',
    inStock: true,
    licenseRequired: true,
  },
  {
    id: 'prod-02',
    slug: 'swarna-sub1-hybrid-paddy-seeds',
    nameEn: 'Swarna-Sub1 Certified Flood-Tolerant Paddy Seeds (10kg)',
    nameBn: 'স্বর্ণা-সাব১ সার্টিফাইড বন্যা-সহনশীল ধানের বীজ (১০ কেজি)',
    brand: 'National Seeds Corp',
    category: 'Seeds',
    categoryBn: 'বীজ',
    sellingPrice: 590,
    retailerPrice: 510,
    moq: 15,
    tierPricing: [
      { minQty: 1, pricePerUnit: 590 },
      { minQty: 15, pricePerUnit: 510 },
      { minQty: 50, pricePerUnit: 475 },
    ],
    batchNumber: 'WB-SEED-8902',
    expiryDate: '2027-06-30',
    inStock: true,
    licenseRequired: false,
  },
  {
    id: 'prod-03',
    slug: 'bayer-confidor-insecticide',
    nameEn: 'Bayer Confidor Insecticide (Imidacloprid 17.8% SL - 250ml)',
    nameBn: 'বায়ার কনফিডোর কীটনাশক (ইমিডাক্লোপ্রিড ১৭.৮% এসএল - ২৫০ মিলি)',
    brand: 'Bayer CropScience',
    category: 'Pesticides',
    categoryBn: 'বালাইনাশক',
    sellingPrice: 460,
    retailerPrice: 395,
    moq: 20,
    tierPricing: [
      { minQty: 1, pricePerUnit: 460 },
      { minQty: 20, pricePerUnit: 395 },
      { minQty: 100, pricePerUnit: 360 },
    ],
    batchNumber: 'BYR-CF-901',
    expiryDate: '2027-01-20',
    inStock: true,
    licenseRequired: true,
  },
];

// GET /api/v1/products - List products with filter & pricing based on role
router.get('/', (req: Request, res: Response) => {
  const { category, brand, role, q } = req.query;

  let results = [...mockProducts];

  if (category && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (brand && brand !== 'All') {
    results = results.filter((p) => p.brand.toLowerCase() === String(brand).toLowerCase());
  }

  if (q) {
    const query = String(q).toLowerCase();
    results = results.filter(
      (p) =>
        p.nameEn.toLowerCase().includes(query) ||
        p.nameBn.includes(query) ||
        p.brand.toLowerCase().includes(query)
    );
  }

  return res.status(200).json({
    success: true,
    count: results.length,
    isWholesaleMode: role === 'retailer',
    data: results,
  });
});

// GET /api/v1/products/:slug - Product details
router.get('/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = mockProducts.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found in AgroCare catalog.',
    });
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

export default router;

