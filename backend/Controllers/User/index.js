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
import Subscriber from '../../Models/Users/subscribers.js';
dotenv.config();

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

        // Check if the user is an admin
        const admin = await Admin.findOne({ email });
        if (admin) {
            // simple check for admin password (in a real-world scenario, you would hash the password and compare)
             const isMatch = admin.password === password; // Replace with bcrypt.compare if passwords are hashed
            // const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(401).json({ error: 'Invvvalid credentials' });

            const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1000000h' });
            return res.json({ message: 'Admin login successful', token, user: { name: admin.name, email: admin.email, role: 'admin' } });
        }

        // Check if the user is a regular user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid user credentials' });

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1000000h' });
        res.json({ message: 'User login successful', token, user: { name: user.name, email: user.email, role: 'user' } });
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

// add to subscribers...
export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ error: 'Already subscribed' });
        }
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Add to Wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        const itemExists = wishlist.items.some(item => item.productId.toString() === productId);
        if (itemExists) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        wishlist.items.push({ productId });
        await wishlist.save();

        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the wishlist and populate
        const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');

        if (!wishlist) {
            // It's okay if a user doesn't have a wishlist yet, return empty
            return res.status(200).json({ userId, items: [] });
            // Or return 404 if you prefer:
            // return res.status(404).json({ error: 'Wishlist not found' });
        }

        // --- Optional Filtering Step ---
        // Filter out items where population resulted in null (product deleted)
        const validItems = wishlist.items.filter(item => item.productId !== null);
        // --- End Filtering Step ---

        // Return the wishlist object with only valid items
        res.status(200).json({
            _id: wishlist._id,
            userId: wishlist.userId,
            items: validItems, // Send the filtered list
            createdAt: wishlist.createdAt,
            updatedAt: wishlist.updatedAt
        });

    } catch (error) {
        console.error("Error in getWishlist:", error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== id);
        await wishlist.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log(`productId: ${productId}, quantity: ${quantity}`);
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Update Cart
export const updateCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAdd } = req.body;
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === id);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        if (isAdd) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items[itemIndex].quantity -= 1;
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1); // Remove item if quantity is 0 or less
            }
        }

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get Cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== id);
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Cart cleared', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Checkout Cart
export const checkoutCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Example: Calculate total price
        const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

        // Clear the cart after checkout
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Checkout successful', total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};