import { Router } from 'express';
import { login, signup, changePassword, updateCart, addToWishlist, getWishlist, removeFromWishlist, addToCart, getCart, clearCart, removeFromCart, checkoutCart } from './../../Controllers/User/index.js';
import { uploadSvg, getAllSvgs, DeleteSvg, getSvgByCategory, getSvgBySlug, getTopSvgsByCategory, getHomepageTopSvg, getHomepageRandomSvgs, EditSvg, getBannersAndInstagramProducts, getRandomProducts } from './../../Controllers/Svgs/index.js';
import { createPaymentIntent, createOrder, getOrders, getAllOrders, updateOrderStatus } from './../../Controllers/Order/index.js';
import { authenticate, authorizeAdmin } from './../../Middleware/AuthMiddleware.js';

const router = Router();

// User routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/change-password', authenticate, changePassword);

// Wishlist routes
router.post('/wishlist', authenticate, addToWishlist);
router.get('/wishlist', authenticate, getWishlist);
router.delete('/wishlist/:id', authenticate, removeFromWishlist);

// Cart routes
router.post('/cart', authenticate, addToCart);
router.put('/cart/:id', authenticate, updateCart);
router.get('/cart', authenticate, getCart);
router.delete('/cart/:id', authenticate, removeFromCart);
router.delete('/cart', authenticate, clearCart);
router.post('/cart/checkout', authenticate, checkoutCart);

// Payment and Order routes
router.post('/create-payment-intent', authenticate, createPaymentIntent);
router.post('/orders', authenticate, createOrder);
router.get('/orders', authenticate, getOrders);
router.get('/admin/orders', authenticate, authorizeAdmin, getAllOrders);
router.put('/admin/orders/:orderId', authenticate, authorizeAdmin, updateOrderStatus);

// Admin routes
router.post('/upload-svg', authenticate, authorizeAdmin, uploadSvg);
router.put('/svgs/:id', authenticate, authorizeAdmin, EditSvg);
router.delete('/svgs/:id', authenticate, authorizeAdmin, DeleteSvg);

// Public routes
router.get('/svgs', getAllSvgs);
router.get('/svgs/category/:category', getSvgByCategory);
router.get('/svgs/:slug', getSvgBySlug);
router.get('/homepagesvgcategories', getTopSvgsByCategory);
router.get('/home', getHomepageRandomSvgs);
router.get('/homepagetopsvg', getHomepageTopSvg);
router.get('/homepagerandomsvgs', getHomepageRandomSvgs);
router.get('/homepagetop', getBannersAndInstagramProducts);
router.get('/random-products', getRandomProducts);

export default router;