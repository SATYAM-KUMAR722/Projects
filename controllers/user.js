const User = require('../models/user');
const { saveRedirectUser } = require('../middleware');

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.Signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        const registeredUser = await User.register(newuser, password);
        req.login(registeredUser,saveRedirectUser ,(err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to our Service!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }   
}

module.exports.renderLogin =  (req, res) => {
    res.render("users/login.ejs")
}

module.exports.Login = async(req, res) => {
    req.flash("success", "Welcome Back!")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
}

module.exports.Logout = async(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logout Successfully!")
        res.redirect("/listings")
    })
}