import Order from '../../Models/Order/index.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card']
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

// Create order after successful payment
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentInfo, modifiedSvgContent } = req.body;
    const userId = req.user.id;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order with modified SVG content
    const order = new Order({
      userId,
      items: items.map(item => ({
        ...item,
        modifiedSvgContent: item.modifiedSvgContent || null
      })),
      totalAmount,
      shippingAddress,
      paymentInfo,
      status: 'processing'
    });

    await order.save();

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    console.log(req.user);  
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort('-createdAt');
    console.log("orders",orders);
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get order by session ID
export const getOrderBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params
    const order = await Order.findOne({ 'paymentDetails.stripeSessionId': sessionId })
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.status(200).json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params
    const orders = await Order.find({ userId }).sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    console.error('Error fetching user orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.status(200).json(order)
  } catch (error) {
    console.error('Error fetching order details:', error)
    res.status(500).json({ error: 'Failed to fetch order details' })
  }
}
