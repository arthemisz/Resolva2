import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                error: 'Please provide name, email, and password.' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long.' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Email already registered.' 
            });
        }

        // Hash password manually (bypass pre-save hook issues)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user directly in collection
        const result = await User.collection.insertOne({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const userId = result.insertedId;

        // Generate token
        const token = generateToken(userId);

        // Return user and token
        res.status(201).json({
            message: 'Registration successful!',
            token,
            user: {
                _id: userId,
                name,
                email,
                role: 'user',
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Registration failed. Please try again.' 
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Please provide email and password.' 
            });
        }

        // Find user (include password field)
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid email or password.' 
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ 
                error: 'Account is deactivated. Please contact support.' 
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Invalid email or password.' 
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user and token
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed. Please try again.' 
        });
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
    try {
        // req.user is set by authenticate middleware
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found.' 
            });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            error: 'Failed to get profile.' 
        });
    }
};

/**
 * Update user profile
 * PUT /api/auth/me
 */
export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ 
                error: 'Please provide name to update.' 
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Profile updated successfully!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            error: 'Failed to update profile.' 
        });
    }
};

/**
 * Change password
 * PUT /api/auth/password
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'Please provide current and new password.' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'New password must be at least 6 characters long.' 
            });
        }

        // Get user with password
        const user = await User.findById(req.userId).select('+password');

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Current password is incorrect.' 
            });
        }

        // Update password
        user.password = newPassword;
        await user.save(); // Will trigger pre-save hook to hash

        res.status(200).json({
            message: 'Password changed successfully!',
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            error: 'Failed to change password.' 
        });
    }
};
