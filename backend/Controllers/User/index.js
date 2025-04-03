import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './../../Models/Users/index.js';
import Svg from './../../Models/SVGs/index.js';
import dotenv from 'dotenv';

dotenv.config();

// User Signup
import slugify from 'slugify';

export const signup = async (req, res) => {
    try {
        console.log(req.body);
        
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const slug = slugify(name, { lower: true, strict: true }); // Generate slug
        
        console.log(`name: ${name}, email: ${email}, password: ${password}, slug: ${slug}`);
        
        const user = new User({ name, email, password: hashedPassword, role: 'user', slug });
        await user.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);   
        res.status(400).json({ error: error.message });
    }
};
// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`email: ${email}, password: ${password}`);
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Upload SVG (Admin Only)
export const uploadSvg = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
        
        const { name, url } = req.body;
        const newSvg = new Svg({ name, url });
        await newSvg.save();
        res.status(201).json({ message: 'SVG uploaded successfully' });
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
        const svgs = await Svg.find().limit(5);
        res.json(svgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get SVGs for Home Page
export const getHomePageSvgs = async (req, res) => {
    try {
        const svgs = await Svg.find().limit(10);
        res.json(svgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
