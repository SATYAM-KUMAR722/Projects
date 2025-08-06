const Listing = require('../models/listing')
const Reviews = require("../models/review")

module.exports.createReview = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    const reviewData = req.body.review;
    const newReview = new Reviews(reviewData);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
      req.flash("success", "New review added");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview = async (req, res) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
     req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`)
} 