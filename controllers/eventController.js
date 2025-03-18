class eventController {
    async getAllEvnets (req, res) {

    }

    async createEventForm (req,res) {
        res.render('base', { title: 'Create event', content: 'create_event', showLogin: false, 
            showSignup: false });
    }

    async getEventById (req, res) {
        
    }
}

export default new eventController();