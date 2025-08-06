const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing")
const Reviews = require("../models/review")
const wrayAsync = require('../utils/wrapAsync')
const { validateReview, isLoggedIn , isAuthor} = require('../middleware');
const reviewContoller = require("../controllers/reviews")


router.post("/",isLoggedIn, validateReview,  wrayAsync(reviewContoller.createReview))

router.delete("/:reviewId",isAuthor, wrayAsync(reviewContoller.deleteReview))

module.exports = router;