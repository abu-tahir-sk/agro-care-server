import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', (req: Request, res: Response) => {
  const { name, phone, password, role, district } = req.body;

  if (!name || !phone || !role) {
    return res.status(400).json({
      success: false,
      message: 'Name, phone number, and role are required.',
    });
  }

  return res.status(201).json({
    success: true,
    message: 'User registered successfully. OTP sent for verification.',
    data: {
      userId: `user-${Date.now()}`,
      name,
      phone,
      role,
      district,
      verified: true,
    },
  });
});

// POST /api/v1/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { phone, password, role } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    token: 'jwt-agrocare-demo-token-xyz789',
    user: {
      id: `user-${phone.slice(-4)}`,
      name: phone.includes('98321') ? 'বিপ্লব মণ্ডল' : 'ব্যবহারকারী',
      phone,
      role: role || 'FARMER',
    },
  });
});

// POST /api/v1/auth/verify-otp
router.post('/verify-otp', (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  if (otp === '1234' || otp === '982416' || otp?.length >= 4) {
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
      isVerified: true,
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Invalid OTP code. Please enter the correct code.',
  });
});

export default router;

