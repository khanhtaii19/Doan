import { Request, Response } from 'express';
import Order from '../models/Order';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId: String(userId) } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    // Log để debug — xóa sau khi xác nhận OK
    // console.log('📦 createOrder body:', JSON.stringify(req.body, null, 2));

    const {
      userId,
      items,
      totalAmount,
      finalAmount,
      couponCode,
      shippingAddress,
      paymentMethod,
      status,
      notes,
      originalPaymentMethod,
    } = req.body;

    // ── customerInfo: lấy trực tiếp từ body, fallback parse từ notes ──
    let customerInfo = req.body.customerInfo;
    if (!customerInfo || !customerInfo.name) {
      try {
        const parsed = JSON.parse(notes || '{}');
        if (parsed.customerInfo) customerInfo = parsed.customerInfo;
      } catch { /* notes không phải JSON */ }
    }

    console.log('👤 customerInfo sẽ lưu:', customerInfo);

    const order = new Order({
      userId,
      items,
      totalAmount,
      finalAmount: finalAmount ?? totalAmount,
      couponCode,
      shippingAddress,
      paymentMethod,
      status: status ?? 'processing',
      notes,
      originalPaymentMethod,
      customerInfo: {
        name:          customerInfo?.name          ?? '',
        phone:         customerInfo?.phone         ?? '',
        email:         customerInfo?.email         ?? '',
        province:      customerInfo?.province      ?? '',
        district:      customerInfo?.district      ?? '',
        ward:          customerInfo?.ward          ?? '',
        addressDetail: customerInfo?.addressDetail ?? '',
      },
    });

    await order.save();
    console.log('✅ Order saved, customerInfo:', order.customerInfo);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('❌ createOrder error:', error);
    res.status(400).json({ success: false, message: 'Error creating order', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating order', error });
  }
};