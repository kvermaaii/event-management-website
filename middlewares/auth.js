import { getUser } from './services/auth.js';
async function isAuth(req, res, next){
    const userId = req.cookies.uid;
    const user = getUser(userId);
    if(!userId) return res.redirect("/login");
    if(!user) return res.redirect("/login");

    req.user = user;
    next();
}

