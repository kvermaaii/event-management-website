import User from '../models/user.js';
import Event from '../models/event.js';
import Organizer from '../models/organizer.js';
import Admin from '../models/admin.js';

class adminController {    async loadDashboard (req, res) {
        try {
            // Get counts for dashboard statistics
            const userCount = await User.countDocuments();
            const eventCount = await Event.countDocuments();
            const organizerCount = await Organizer.countDocuments();
            const verifiedOrganizerCount = await Organizer.countDocuments({ verified: true });
            const adminCount = await Admin.countDocuments();
            
            // Get recent events
            const recentEvents = await Event.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('organizerId');
                
            // Since we're in the admin controller and passed the isAdmin middleware,
            // user is guaranteed to be an admin
            const admin = await Admin.findOne({ userId: req.user._id }).populate('userId');
            
            res.render("admin.ejs", {
                userCount,
                eventCount,
                organizerCount,
                verifiedOrganizerCount,
                adminCount,
                recentEvents,
                admin,
                user: req.user
            });
        } catch (error) {
            console.error('Error loading admin dashboard:', error);
            res.status(500).send('Server error');
        }
    }
    
    async getAllUsers (req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    async getAllEvents (req, res) {
        try {
            const events = await Event.find().populate('organizerId');
            res.json(events);
        } catch (error) {
            console.error('Error getting events:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    async getAllOrganizers (req, res) {
        try {
            const organizers = await Organizer.find().populate('userId');
            res.json(organizers);
        } catch (error) {
            console.error('Error getting organizers:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    async getOrganizerById (req, res) {
        try {
            const { id } = req.params;
            const organizer = await Organizer.findById(id).populate('userId');
            
            if (!organizer) {
                return res.status(404).json({ message: 'Organizer not found' });
            }
            
            res.json(organizer);
        } catch (error) {
            console.error('Error getting organizer:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    async verifyOrganizer (req, res) {
        try {
            const { id } = req.params;
            const organizer = await Organizer.findByIdAndUpdate(
                id,
                { verified: true },
                { new: true }
            );
            
            if (!organizer) {
                return res.status(404).json({ message: 'Organizer not found' });
            }
            
            res.json({ message: 'Organizer verified successfully', organizer });
        } catch (error) {
            console.error('Error verifying organizer:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    async rejectOrganizer (req, res) {
        try {
            const { id } = req.params;
            const organizer = await Organizer.findByIdAndUpdate(
                id,
                { verified: false },
                { new: true }
            );
            
            if (!organizer) {
                return res.status(404).json({ message: 'Organizer not found' });
            }
            
            res.json({ message: 'Organizer rejected', organizer });
        } catch (error) {
            console.error('Error rejecting organizer:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    async updateUser (req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            const user = await User.findByIdAndUpdate(id, updateData, { new: true });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ message: 'User updated successfully', user });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    async deleteUser (req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByIdAndDelete(id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
      async createUser (req, res) {
        try {
            const userData = req.body;
            const user = new User(userData);
            await user.save();
            
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

}

export default new adminController();