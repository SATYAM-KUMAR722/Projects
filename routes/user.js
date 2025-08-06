const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrayAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUser } = require('../middleware');
const userContoller = require("../controllers/user")

router.route("/signup")
.get(userContoller.renderSignup )
.post(wrayAsync(userContoller.Signup));


router.route("/login")
.get(userContoller.renderLogin)
.post(saveRedirectUser, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),userContoller.Login );

router.get("/logout", userContoller.Logout )

module.exports = router;    