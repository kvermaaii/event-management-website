class eventController {
    async getAllEvnets (req, res) {

    }

    async createEventForm (req,res) {
        res.render('create_event.ejs')
    }

    async getEventById (req, res) {
        
    }
}

export default new eventController();