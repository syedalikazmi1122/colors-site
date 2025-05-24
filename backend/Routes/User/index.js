import { Router } from 'express';
import { login, signup, changePassword,subscribe , updateCart, addToWishlist, getWishlist, removeFromWishlist, addToCart, getCart, clearCart, removeFromCart, checkoutCart } from './../../Controllers/User/index.js';
import { uploadSvg, getAllSvgs, DeleteSvg, getSvgByCategory, getSvgBySlug, getTopSvgsByCategory, getHomepageTopSvg, getHomepageRandomSvgs, EditSvg, getBannersAndInstagramProducts, getRandomProducts } from './../../Controllers/Svgs/index.js';
import { createPaymentIntent, createOrder, getOrders, getAllOrders, updateOrderStatus } from './../../Controllers/Order/index.js';
import { authenticate, authorizeAdmin } from './../../Middleware/AuthMiddleware.js';
import { searchProducts } from '../../Controllers/Svgs/search.js';
import StripeRoute from './../stripeRoute.js';
import axios from 'axios';

const router = Router();

// User routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/change-password', authenticate, changePassword);

// subscription routes
router.post('/subscribe', subscribe);

// Wishlist routes
router.post('/wishlist', authenticate, addToWishlist);
router.get('/wishlist', authenticate, getWishlist);
router.delete('/wishlist/:id', authenticate, removeFromWishlist);


router.get('/search', searchProducts);


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
router.use('/',StripeRoute);
router.get('/admin/orders', authenticate, authorizeAdmin, getAllOrders);
const API_KEY = "AIzaSyA16R6KTJm4WifnWu1HqulvXO_yXXot2ew";

router.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  console.log('Received translation request:', req.body);

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Required Text' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'Translation service is not configured' });
  }
  console.log("api key",API_KEY);

  try {
   const response = await axios.post(
  `https://translation.googleapis.com/language/translate/v2`,
  null, // no body
  {
    params: {
      q: [text],
      target: targetLang,
      key: API_KEY,
    },
  }
);

    const translatedText = response.data.data.translations[0].translatedText;
    console.log('Translated text:', translatedText);    
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Translation failed',
      details: error.response?.data || error.message
    });
  }
});

export default router;