import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './../../Models/Users/index.js';
import Svg from './../../Models/SVGs/index.js';
import dotenv from 'dotenv';
// User Signup
import slugify from 'slugify';
import Admin from './../../Models/Admin/index.js';
import Cart from '../../Models/Cart/index.js';
import Wishlist from './../../Models/Wishlist/index.js';
dotenv.config();

export const uploadSvg = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

        const { title, category, description, url,price } = req.body;
        console.log(`title: ${title}, category: ${category}, description: ${description}, url: ${url}, price: ${price}`);
        const slug = slugify(title, { lower: true, strict: true }); // Generate slug

        const newSvg = new Svg({ title, category, description, slug,price, url });
        await newSvg.save();
        res.status(201).json({ message: 'SVG uploaded successfully', svg: newSvg });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all SVGs
export const getAllSvgs = async (req, res) => {
    try {
        const svgs = await Svg.find();
        res.json(svgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get SVGs by category
export const getSvgByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const svgs = await Svg.find({ category });
        res.json(svgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Top SVGs by category (Example: limit to 5)
export const getTopSvgsByCategory = async (req, res) => {
    try {
        console.log('Fetching top SVGs by category...');
        const categories = await Svg.distinct('category'); // Get all unique categories
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        const svgs = [];
        for (const category of categories) {
            const randomSvg = await Svg.aggregate([
                { $match: { category } },
                { $sample: { size: 1 } } // Get one random SVG per category
            ]);
            if (randomSvg.length > 0) {
                svgs.push(randomSvg[0]);
            }
        }

        if (svgs.length === 0) {
            return res.status(404).json({ message: 'No SVGs found for the categories' });
        }

        res.status(200).json(svgs);
    } catch (error) {
        console.error('Error fetching top SVGs by category:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get SVGs for Home Page
export const getHomepageRandomSvgs = async (req, res) => {
    try {
        const svgs = await Svg.find().limit(10);
        res.json(svgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get SVG by slug
export const getSvgBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const svg = await Svg.findOne({ slug });
        if (!svg) return res.status(404).json({ error: 'SVG not found' });
        res.json(svg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getHomepageTopSvg = async (req, res) => {
    try {
        const svgs = await Svg.find().limit(1);
        res.json(svgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
