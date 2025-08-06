const Listing = require('../models/listing')

module.exports.index = async (req, res) => {
    const Allistdata = await Listing.find({});
    res.render("listings/index.ejs", { Allistdata });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listingData = req.body.listing;
    const newListing = new Listing(listingData);
    newListing.image = { url, filename }
    newListing.owner = req.user._id;
    req.flash("success", "Listing added successfully");
    await newListing.save();
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.renderEditListing = async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.EditListing = async (req, res) => {

    const id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id,req.body.listing);
    if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename }
    await listing.save();
    }
    req.flash("success", "Listing Updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted successfully");
    res.redirect("/listings");
}