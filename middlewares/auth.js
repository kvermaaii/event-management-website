import { getUser } from '../services/auth.js';

async function authenticateUser(req, res, next) {
    const userId = req.cookies.uid;

    // If no userId is found in cookies, redirect to login
    if (!userId) {
        return res.redirect("/login");
    }

    // Fetch user from the in-memory store
    const user = getUser(userId);

    // If no user is found, redirect to login
    if (!user) {
        return res.redirect("/login");
    }

    // Attach the user to the request object for downstream use
    req.user = user;

    // Proceed to the next middleware
    next();
}

// Export the function with both names for backward compatibility
export { authenticateUser, authenticateUser as isAuth };


