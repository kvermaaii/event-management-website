class userController {
    async loadDashboard (req, res){
        res.render('user_dashboard.ejs')
    }
    async getUserEvents (req, res){

    }
    async getUserProfile (req, res) {

    }
    async updateUserProfile (req, res) {

    }
}

export default new userController();