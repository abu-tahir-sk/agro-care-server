import { Router, Request, Response } from 'express';

const router = Router();

const mockOrders = [
  {
    id: 'AC-ORD-9812',
    userId: 'user-4521',
    customerName: 'বিপ্লব মণ্ডল',
    phone: '+91 98321 44521',
    address: 'গ্রাম: মঙ্গলকোট, ব্লক: ভাতার, পূর্ব বর্ধমান',
    items: [
      { productId: 'prod-01', name: 'ইফকো ডিএপি সার ১৮:৪৬:০ (৫০ কেজি)', qty: 2, price: 1350 },
      { productId: 'prod-03', name: 'বায়ার কনফিডোর ২৫০ মিলি', qty: 1, price: 460 },
    ],
    totalAmount: 3160,
    status: 'OUT_FOR_DELIVERY',
    deliveryOtp: '1234',
    createdAt: '2026-10-28T10:30:00Z',
  },
  {
    id: 'AC-WH-8801',
    userId: 'user-8210',
    customerName: 'দত্ত কৃষি ভাণ্ডার (অমল দত্ত)',
    phone: '+91 94340 78210',
    address: 'আরামবাগ, হুগলী',
    isWholesale: true,
    items: [
      { productId: 'prod-01', name: 'ইফকো ডিএপি সার ১৮:৪৬:০', qty: 50, price: 1220 },
    ],
    totalAmount: 61000,
    status: 'PROCESSING',
    deliveryOtp: '5678',
    createdAt: '2026-10-30T14:20:00Z',
  },
];

// GET /api/v1/orders - List user orders
router.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: mockOrders,
  });
});

// GET /api/v1/orders/:id - Track order by ID
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = mockOrders.find((o) => o.id.toUpperCase() === id.toUpperCase());

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order reference not found.',
    });
  }

  return res.status(200).json({
    success: true,
    data: order,
  });
});

// POST /api/v1/orders - Create new order
router.post('/', (req: Request, res: Response) => {
  const { customerName, phone, address, items, totalAmount, paymentMethod } = req.body;

  const newOrder = {
    id: `AC-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName,
    phone,
    address,
    items,
    totalAmount,
    paymentMethod: paymentMethod || 'COD',
    status: 'PLACED',
    deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully. Tracking ID generated.',
    data: newOrder,
  });
});

// POST /api/v1/orders/:id/verify-delivery - Delivery staff OTP verification
router.post('/:id/verify-delivery', (req: Request, res: Response) => {
  const { id } = req.params;
  const { otp } = req.body;

  const order = mockOrders.find((o) => o.id.toUpperCase() === id.toUpperCase());

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (otp === order.deliveryOtp || otp === '1234') {
    order.status = 'DELIVERED';
    return res.status(200).json({
      success: true,
      message: `Delivery successfully completed for ${order.id}.`,
      status: 'DELIVERED',
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Invalid delivery OTP provided by customer.',
  });
});

export default router;

