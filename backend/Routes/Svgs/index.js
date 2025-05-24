import express from 'express';
import { searchProducts } from '../../Controllers/Svgs/search.js';

const router = express.Router();

// Search route
router.get('/search', searchProducts);

export default router; 