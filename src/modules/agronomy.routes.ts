import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/v1/services/weather - District agro-meteorology bulletin
router.get('/weather', (req: Request, res: Response) => {
  const districts = [
    {
      district: 'Purba Bardhaman',
      districtBn: 'পূর্ব বর্ধমান',
      temp: '২৮° সেলসিয়াস',
      condition: 'পরিষ্কার ও রৌদ্রোজ্জ্বল (Sunny)',
      humidity: '৬৫%',
      rainProbability: '১০%',
      windSpeed: '৮ কিমি/ঘণ্টা',
      advisoryBn: 'আলু ক্ষেতে শেষ চাষ ও সার প্রয়োগের উপযুক্ত সময়। রাতে কুয়াশা থাকলে নাবি ধসা সতর্কবার্তা বজায় রাখুন।',
    },
    {
      district: 'Hooghly',
      districtBn: 'হুগলী',
      temp: '২৯° সেলসিয়াস',
      condition: 'আংশিক মেঘলা (Partly Cloudy)',
      humidity: '৭০%',
      rainProbability: '১৫%',
      windSpeed: '৭ কিমি/ঘণ্টা',
      advisoryBn: 'সবজি ও মরিচ ক্ষেতে সাদা মাছি ও চোষক পোকা দমনে ইমিডাক্লোপ্রিড স্প্রে করার পরামর্শ।',
    },
    {
      district: 'Nadia',
      districtBn: 'নদীয়া',
      temp: '২৮° সেলসিয়াস',
      condition: 'পরিষ্কার (Clear Sky)',
      humidity: '৬২%',
      rainProbability: '৫%',
      windSpeed: '৯ কিমি/ঘণ্টা',
      advisoryBn: 'সরিষা চাষের জন্য জমি তৈরির আদর্শ আর্দ্রতা বজায় রয়েছে। বীজ শোধন করে বপন করুন।',
    },
  ];

  return res.status(200).json({
    success: true,
    bulletinDate: new Date().toISOString(),
    data: districts,
  });
});

// POST /api/v1/services/calculator - Fertilizer dosage computation
router.post('/calculator', (req: Request, res: Response) => {
  const { crop, area, unit, soilFertility } = req.body;

  const cropDoses: Record<string, { urea: number; dap: number; mop: number; compost: number }> = {
    potato: { urea: 35, dap: 50, mop: 30, compost: 500 },
    paddy: { urea: 25, dap: 20, mop: 15, compost: 300 },
    tomato: { urea: 20, dap: 25, mop: 20, compost: 400 },
    mustard: { urea: 15, dap: 20, mop: 10, compost: 250 },
    wheat: { urea: 30, dap: 25, mop: 15, compost: 300 },
  };

  const multiplier = unit === 'acre' ? 3 : 1;
  const fertilityFactor = soilFertility === 'low' ? 1.2 : soilFertility === 'high' ? 0.85 : 1.0;

  const currentDose = cropDoses[crop?.toLowerCase()] || cropDoses.potato;
  const parsedArea = Number(area) || 1;

  const totalUrea = Math.round(currentDose.urea * parsedArea * multiplier * fertilityFactor);
  const totalDap = Math.round(currentDose.dap * parsedArea * multiplier * fertilityFactor);
  const totalMop = Math.round(currentDose.mop * parsedArea * multiplier * fertilityFactor);
  const totalCompost = Math.round(currentDose.compost * parsedArea * multiplier * fertilityFactor);

  return res.status(200).json({
    success: true,
    calculation: {
      crop: crop || 'potato',
      area: parsedArea,
      unit: unit || 'bigha',
      ureaKg: totalUrea,
      dapKg: totalDap,
      mopKg: totalMop,
      organicCompostKg: totalCompost,
      estimatedCostInr: Math.round(totalUrea * 6 + totalDap * 27 + totalMop * 34),
    },
  });
});

export default router;

