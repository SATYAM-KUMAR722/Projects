const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require('./utils/ExpressError');
const {listingSchema ,reviewSchema } = require('./schema.js');
const review = require("./models/review.js");

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){ 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged to make a listing");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUser = ( req, res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

const isOwner = async (req, res, next) => {
    const id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
} 

const isAuthor = async (req, res, next) => {
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = {isLoggedIn ,saveRedirectUser,isOwner,validateListing,validateReview ,isAuthor};