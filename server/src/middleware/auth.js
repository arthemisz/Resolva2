import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

/**
 * Middleware to protect routes - requires valid JWT token
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'No token provided. Please login.' 
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({ 
                error: 'Invalid or expired token. Please login again.' 
            });
        }

        // Get user from database
        const user = await User.findById(decoded.userId);
        
        if (!user || !user.isActive) {
            return res.status(401).json({ 
                error: 'User not found or inactive.' 
            });
        }

        // Attach user to request
        req.user = user;
        req.userId = user._id;
        
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed.' });
    }
};

/**
 * Optional middleware - attach user if token exists, but don't require it
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            
            if (decoded) {
                const user = await User.findById(decoded.userId);
                if (user && user.isActive) {
                    req.user = user;
                    req.userId = user._id;
                }
            }
        }
        
        next();
    } catch (error) {
        // If optional auth fails, just continue without user
        next();
    }
};
