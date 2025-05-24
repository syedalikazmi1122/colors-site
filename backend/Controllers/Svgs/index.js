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
import nodemailer from 'nodemailer';
import Subscriber from './../../Models/Users/subscribers.js'
import { translateObject, translateArray } from '../../Utils/translator.js';

dotenv.config();


const createTransporter = async () => {
  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fabbhome@gmail.com',
        pass: 'kwot wwja jdvm vmvt', 
      },
    });
  } catch (error) {
    console.error('Failed to create transporter:', error);
    throw new Error('Failed to create transporter');
  }
};

export const uploadSvg = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      productID,
      title,
      price,
      category,
      description,
      url,
      isfeatured,
      editablecolors,
      isbanner,
      instagram_link,
      material,
      materialDescription
    } = req.body;

    if (!productID || !title || !price || !category || !description || !url) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Handle translations for title and description
    const translatedTitle = {
      en: title.en || title,
      es: title.es || '',
      fr: title.fr || '',
      de: title.de || ''
    };

    const translatedDescription = {
      en: description.en || description,
      es: description.es || '',
      fr: description.fr || '',
      de: description.de || ''
    };

    // Handle material translations if provided
    const translatedMaterial = material ? material.map(item => ({
      en: item.en || item,
      es: item.es || '',
      fr: item.fr || '',
      de: item.de || ''
    })) : [];

    const translatedMaterialDescription = materialDescription ? {
      en: materialDescription.en || materialDescription,
      es: materialDescription.es || '',
      fr: materialDescription.fr || '',
      de: materialDescription.de || ''
    } : { en: '', es: '', fr: '', de: '' };

    // Generate a base slug
    let baseSlug = slugify(translatedTitle.en, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Keep checking if slug exists and update it if needed
    while (await Svg.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Check if this productID already has an entry
    const existingSvg = await Svg.findOne({ productID });
    if (existingSvg) {
      return res.status(400).json({ error: 'A design with this title already exists for the same product' });
    }

    const newSvg = new Svg({
      productID,
      title: translatedTitle,
      price,
      category,
      description: translatedDescription,
      url,
      slug,
      isfeatured: Boolean(isfeatured),
      editablecolors: editablecolors || [],
      isbanner: Boolean(isbanner),
      instagram_link,
      material: translatedMaterial,
      materialDescription: translatedMaterialDescription
    });

    await newSvg.save();

    // Send emails to all subscribers
    const transporter = await createTransporter();
    const subscribers = await Subscriber.find({}, 'email');

    const mailOptions = {
      from: 'fabbhome@gmail.com',
      subject: '✨ New Wallpaper Design Just Dropped!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <div style="background-color: black; color: white; padding: 20px; text-align: center;">
            <h1>FABBHOME</h1>
            <p>WALLPAPER • MURALS • CURTAINS • FURNISHINGS</p>
          </div>
          <div style="padding: 20px;">
            <h2>${translatedTitle.en}</h2>
            ${url.map(image => `
              <img src="${image}" alt="${translatedTitle.en}" style="width: 100%; max-width: 600px; margin-bottom: 10px; border-radius: 5px;" />
            `).join('')}
            <p style="margin: 20px 0;">${translatedDescription.en}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Price:</strong> $${price}</p>
            <a href="${instagram_link || '#'}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #2f4f4f; color: white; text-decoration: none; border-radius: 4px;">Shop Now</a>
          </div>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <p>You're receiving this email because you're subscribed to FabbHome updates.</p>
          </div>
        </div>
      `
    };

    const mailPromises = subscribers.map(subscriber =>
      transporter.sendMail({ ...mailOptions, to: subscriber.email })
    );

    await Promise.all(mailPromises);

    res.status(201).json({
      message: 'SVG uploaded and emails sent to subscribers successfully',
      svg: newSvg
    });

  } catch (error) {
    console.error('Error in uploadSvg:', error);
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
      instagram_link,
      ismeasureable,
      material,
      materialDescription
    } = req.body;

    // Validate required fields
    if (!title || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Handle translations for title and description
    const translatedTitle = {
      en: title.en || title,
      es: title.es || '',
      fr: title.fr || '',
      de: title.de || ''
    };

    const translatedDescription = {
      en: description.en || description,
      es: description.es || '',
      fr: description.fr || '',
      de: description.de || ''
    };

    // Handle material translations if provided
    const translatedMaterial = material ? material.map(item => ({
      en: item.en || item,
      es: item.es || '',
      fr: item.fr || '',
      de: item.de || ''
    })) : [];

    const translatedMaterialDescription = materialDescription ? {
      en: materialDescription.en || materialDescription,
      es: materialDescription.es || '',
      fr: materialDescription.fr || '',
      de: materialDescription.de || ''
    } : { en: '', es: '', fr: '', de: '' };

    // Generate slug from title
    const slug = slugify(translatedTitle.en, {
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
        title: translatedTitle,
        price,
        category,
        description: translatedDescription,
        url,
        slug,
        iseditable: Boolean(iseditable),
        isfeatured: Boolean(isfeatured),
        isbanner: Boolean(isbanner),
        featureOnInstagram: Boolean(featureOnInstagram),
        editablecolors: iseditable ? editablecolors : [],
        instagram_link,
        ismeasureable: Boolean(ismeasureable),
        material: translatedMaterial,
        materialDescription: translatedMaterialDescription,
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
      console.log("called homepage random svgs") 
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

// Get banners and products with Instagram links
export const getBannersAndInstagramProducts = async (req, res) => {
  console.log("called banners and instagram products")
  try {
    const banners = await Svg.find({ isbanner: true });
    const instagramProducts = await Svg.find({ featureOnInstagram: true });
    
    res.status(200).json({
      success: true,
      data: {
        banners,
        instagramProducts
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get random products from all categories
export const getRandomProducts = async (req, res) => {
  try {
    // Get all unique categories
    const categories = await Svg.distinct('category');
    
    // Get 2 random products from each category
    const productsByCategory = await Promise.all(
      categories.map(async (category) => {
        const products = await Svg.aggregate([
          { $match: { category } },
          { $sample: { size: 2 } }
        ]);
        return { category, products };
      })
    );

    res.status(200).json({
      success: true,
      data: productsByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

