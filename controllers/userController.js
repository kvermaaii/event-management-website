class userController {    async loadDashboard (req, res){
        try {
            // Check if user is available through req.user (from middleware) or req.session.user
            let userId = null;
            if (req.user) {
                userId = req.user._id;
            } else if (req.session.userId) {
                userId = req.session.userId;
            } else {
                // No authenticated user, redirect to login page
                console.log('No authenticated user found, redirecting to login');
                return res.redirect('/login');
            }
            
            // Find user by ID (excluding password hash)
            const User = (await import('../models/user.js')).default;
            let user;
            
            try {
                // If userId exists, try to find the user
                if (userId) {
                    user = await User.findById(userId).select('-passwordHash');
                }
            } catch (error) {
                console.error('Error finding user:', error);
                return res.redirect('/login');
            }
            
            // If user not found, redirect to login
            if (!user) {
                console.error('User not found in database');
                return res.redirect('/login');
            }
              // Generate username from name as a fallback if not provided
            const username = user.username || user.name.replace(/\s+/g, '').toLowerCase();
            
            // Render dashboard with user data
            res.render('user_dashboard.ejs', { 
                user: {
                    ...user._doc,
                    username
                }
            });} catch (error) {
            console.error('Error loading dashboard:', error);
            return res.redirect('/login');
        }
    }
    
    async getUserEvents (req, res){
        try {
            // Get user ID from either req.user or req.session
            let userId = null;
            if (req.user) {
                userId = req.user._id;
            } else if (req.session.userId) {
                userId = req.session.userId;
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            
            // Find all registrations for this user and populate event details
            const Registration = (await import('../models/registration.js')).default;
            const Event = (await import('../models/event.js')).default;
            
            const registrations = await Registration.find({ userId })
                .populate({
                    path: 'eventId',
                    model: 'Event',
                    select: 'title description startDateTime endDateTime venue ticketPrice status'
                });
            
            // Extract the event data from registrations
            const events = registrations.map(registration => registration.eventId);
            
            res.status(200).json({
                success: true,
                events
            });
        } catch (error) {
            console.error('Error fetching user events:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve events',
                error: error.message
            });
        }
    }
    
    async getUserProfile (req, res) {
        try {
            // Get user ID from either req.user or req.session
            let userId = null;
            if (req.user) {
                userId = req.user._id;
            } else if (req.session.userId) {
                userId = req.session.userId;
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            
            // Find user by ID (excluding password hash)
            const User = (await import('../models/user.js')).default;
            const user = await User.findById(userId).select('-passwordHash');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve profile',
                error: error.message
            });
        }
    }
    
    async updateUserProfile (req, res) {
        try {
            // Get user ID from either req.user or req.session
            let userId = null;
            if (req.user) {
                userId = req.user._id;
            } else if (req.session.userId) {
                userId = req.session.userId;
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
              // Get updated profile data from request body
            const { name, phone, username } = req.body;
            
            // Validate required fields
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required'
                });
            }
            
            // Create update object with only the fields from our model
            const updateData = { 
                name,
                // We'll add other fields to the model as needed
                // Store additional fields as a profile object in the future if needed
            };
            
            // Update the user profile
            const User = (await import('../models/user.js')).default;
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            ).select('-passwordHash');
            
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            
            // Check for duplicate email error
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    }
    
    async changePassword(req, res) {
        try {
            // Get user ID from either req.user or req.session
            let userId = null;
            if (req.user) {
                userId = req.user._id;
            } else if (req.session.userId) {
                userId = req.session.userId;
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            
            // Get current password and new password from request body
            const { currentPassword, newPassword } = req.body;
            
            // Validate required fields
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }
            
            // Find the user
            const User = (await import('../models/user.js')).default;
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            // Import bcrypt for password hashing
            const bcrypt = (await import('bcrypt')).default;
            
            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }
            
            // Hash new password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(newPassword, saltRounds);
            
            // Update password
            user.passwordHash = passwordHash;
            await user.save();
            
            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to change password',
                error: error.message
            });
        }
    }
}

export default new userController();