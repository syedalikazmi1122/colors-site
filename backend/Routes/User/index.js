import { Router } from 'express';
import { login, signup, changePassword,uploadSvg, getAllSvgs, getSvgByCategory, getTopSvgsByCategory, getHomePageSvgs } from './../../Controllers/User/index.js';
import { authenticate, authorizeAdmin } from './../../Middleware/AuthMiddleware.js';

const router = Router();

// User routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/change-password', authenticate, changePassword);

// Admin routes (requires authentication and admin role)
router.post('/upload-svg', authenticate, authorizeAdmin, uploadSvg);

// Public routes
router.get('/svgs', getAllSvgs);
router.get('/svgs/category/:category', getSvgByCategory);
router.get('/svgs/top', getTopSvgsByCategory);
router.get('/svgs/home', getHomePageSvgs);

export default router;