class userController {
    async loadDashboard (req, res){
        res.render('user_dashboard.ejs')
    }
    
    async getUserEvents (req, res){
        try {
            // Get user ID from the authenticated session
            const userId = req.session.user._id;
            
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
            // Get user ID from the authenticated session
            const userId = req.session.user._id;
            
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
            // Get user ID from the authenticated session
            const userId = req.session.user._id;
            
            // Get updated profile data from request body
            const { name, email } = req.body;
            
            // Validate required fields
            if (!name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and email are required fields'
                });
            }
            
            // Update the user profile
            const User = (await import('../models/user.js')).default;
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, email },
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
}

export default new userController();