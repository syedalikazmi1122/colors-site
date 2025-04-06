import { Router } from 'express';
import { login, signup, changePassword,  addToWishlist,getWishlist,removeFromWishlist,addToCart,getCart,clearCart,removeFromCart,checkoutCart  } from './../../Controllers/User/index.js';
import { uploadSvg, getAllSvgs, getSvgByCategory, getSvgBySlug,getTopSvgsByCategory,getHomepageTopSvg,getHomepageRandomSvgs } from './../../Controllers/Svgs/index.js';
import { authenticate, authorizeAdmin } from './../../Middleware/AuthMiddleware.js';

const router = Router();

// User routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/change-password', authenticate, changePassword);
// wishlist routes and cart routes
 router.post('/wishlist', authenticate, addToWishlist);
 router.get('/wishlist', authenticate, getWishlist);
router.delete('/wishlist/:id', authenticate, removeFromWishlist);
router.post('/cart', authenticate, addToCart);
router.get('/cart', authenticate, getCart);
router.delete('/cart/:id', authenticate, removeFromCart);
router.delete('/cart', authenticate, clearCart);
router.post('/cart/checkout', authenticate, checkoutCart);

// Admin routes (requires authentication and admin role)
router.post('/upload-svg', authenticate, authorizeAdmin, uploadSvg);

// Public routes
router.get('/svgs', getAllSvgs);
router.get('/svgs/category/:category', getSvgByCategory);
// get svg 
router.get('/svgs/:slug', getSvgBySlug); 
router.get('/homepagesvgcategories', getTopSvgsByCategory);
router.get('/svgs/home', getHomepageRandomSvgs);
router.get('/homepagetopsvg', getHomepageTopSvg);
router.get('/homepagerandomsvgs', getHomepageRandomSvgs);



export default router;