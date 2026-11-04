import { Router, Request, Response } from 'express';

const router = Router();

// Mock Licenses
const mockLicenses = [
  {
    id: 'LIC-01',
    applicant: 'দত্ত কৃষি ভাণ্ডার',
    owner: 'অমল দত্ত',
    type: 'Pesticide License Renewal',
    licenseNumber: 'WB/PEST/RT-44120',
    district: 'হুগলী (Hooghly)',
    authority: 'Licensing Officer, Hooghly',
    expiryDate: '2028-08-15',
    status: 'VERIFIED',
    documentUrl: 'https://agrocare.in/docs/lic-44120.pdf',
    verifiedAt: '2026-09-10T11:00:00Z',
  },
  {
    id: 'LIC-02',
    applicant: 'মা তারা এগ্রো সেন্টার',
    owner: 'সুমন মণ্ডল',
    type: 'Seed Dealer License',
    licenseNumber: 'WB/SEED/DL-1902',
    district: 'পূর্ব বর্ধমান (Purba Bardhaman)',
    authority: 'Department of Agriculture, WB',
    expiryDate: '2027-12-31',
    status: 'PENDING',
    documentUrl: 'https://agrocare.in/docs/seed-lic-1902.pdf',
    verifiedAt: null,
  },
  {
    id: 'LIC-03',
    applicant: 'বরেন্দ্র ফার্টিলাইজার হাব',
    owner: 'অরুণ ঘোষ',
    type: 'Fertilizer Wholesale License',
    licenseNumber: 'WB/AGR/FL-88901',
    district: 'মালদা (Malda)',
    authority: 'Directorate of Agriculture, WB',
    expiryDate: '2027-04-30',
    status: 'PENDING',
    documentUrl: 'https://agrocare.in/docs/fert-88901.pdf',
    verifiedAt: null,
  },
];

// GET /api/v1/licenses - List compliance licenses
router.get('/', (req: Request, res: Response) => {
  const { status, district } = req.query;

  let results = [...mockLicenses];
  if (status) {
    results = results.filter((l) => l.status.toLowerCase() === String(status).toLowerCase());
  }
  if (district) {
    results = results.filter((l) => l.district.includes(String(district)));
  }

  return res.status(200).json({
    success: true,
    total: results.length,
    pendingCount: mockLicenses.filter((l) => l.status === 'PENDING').length,
    data: results,
  });
});

// POST /api/v1/licenses/:id/verify - Admin approve/reject license
router.post('/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, remarks } = req.body; // action: 'APPROVE' | 'REJECT'

  const license = mockLicenses.find((l) => l.id.toUpperCase() === id.toUpperCase());

  if (!license) {
    return res.status(404).json({ success: false, message: 'License record not found.' });
  }

  if (action === 'APPROVE') {
    license.status = 'VERIFIED';
    license.verifiedAt = new Date().toISOString();
    return res.status(200).json({
      success: true,
      message: `License ${license.licenseNumber} verified successfully. Controlled product trading enabled.`,
      data: license,
    });
  } else {
    license.status = 'REJECTED';
    return res.status(200).json({
      success: true,
      message: `License rejected. Reason: ${remarks || 'Incomplete documentation.'}`,
      data: license,
    });
  }
});

export default router;

