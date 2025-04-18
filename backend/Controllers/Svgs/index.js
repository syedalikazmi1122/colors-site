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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      title,
      price,
      category,
      description,
      url,
      isfeatured,
      editablecolors,
      isbanner,
      instagram_link
    } = req.body;

    // Validate required fields
    if (!title || !price || !category || !description || !url) {
      console.log('price title category description url', price, title, category, description, url);
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug already exists
    const existingSvg = await Svg.findOne({ slug });
    if (existingSvg) {
      return res.status(400).json({ error: 'A design with this title already exists' });
    }

    // Create new SVG document
    const newSvg = new Svg({
      title,
      price,
      category,
      description,
      url,
      slug,
      isfeatured: Boolean(isfeatured),
      isbanner: Boolean(isbanner),
      instagram_link
    });

    await newSvg.save();

    res.status(201).json({
      message: 'SVG uploaded successfully',
      svg: newSvg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const EditSvg = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      price,
      category,
      description,
      url,
      iseditable,
      featureOnInstagram,
      isfeatured,
      isbanner,
      editablecolors,
      instagram_link
    } = req.body;

    // Validate required fields
    if (!title || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Generate slug from title
    const slug = slugify(title, {
      lower: true,
      strict: true
    });

    // Check if slug already exists (excluding current SVG)
    const existingSlug = await Svg.findOne({
      slug,
      _id: { $ne: id }
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'A design with this title already exists'
      });
    }

    // Update SVG document
    const updatedSvg = await Svg.findByIdAndUpdate(
      id,
      {
        title,
        price,
        category,
        description,
        url,
        slug,
        iseditable: Boolean(iseditable),
        isfeatured: Boolean(isfeatured),
        isbanner: Boolean(isbanner),
        featureOnInstagram: Boolean(featureOnInstagram),
        editablecolors: iseditable ? editablecolors : [],
        instagram_link,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedSvg) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedSvg,
      message: 'Design updated successfully'
    });

  } catch (error) {
    console.error('Error updating design:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A design with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating design',
      error: error.message
    });
  }
};

// Get all SVGs
export const GetAllSvgs = async (req, res) => {
  try {
    const svgs = await Svg.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: svgs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching designs',
      error: error.message
    });
  }
};

// Delete SVG
export const DeleteSvg = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedSvg = await Svg.findByIdAndDelete(id);

    if (!deletedSvg) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting design',
      error: error.message
    });
  }
};

// Get single SVG by ID or slug
export const GetSvgById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    // Try to find by ID first, then by slug if ID not found
    let svg = await Svg.findById(idOrSlug);

    if (!svg) {
      svg = await Svg.findOne({ slug: idOrSlug });
    }

    if (!svg) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.status(200).json({
      success: true,
      data: svg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching design',
      error: error.message
    });
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
  console.log("called")
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
