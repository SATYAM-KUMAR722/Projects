const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrayAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing} = require('../middleware');
const listingController = require('../controllers/listing')
const multer = require('multer');
const {storage} = require('../cloud.Config')
const uplaod = multer({ storage })

router.route("/")
.get(wrayAsync(listingController.index ))
.post(isLoggedIn, validateListing,uplaod.single('listing[image]'), wrayAsync(listingController.createListing));


router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrayAsync(listingController.showListing))
.put( isLoggedIn,isOwner, validateListing,uplaod.single('listing[image]'), wrayAsync(listingController.EditListing))
.delete(isLoggedIn,isOwner, wrayAsync(listingController.deleteListing));



router.get("/:id/edit", isLoggedIn,isOwner, wrayAsync(listingController.renderEditListing));

module.exports = router;
