const ExpressError = require("../utils/ExpressError.js");4
const listing = require("../Models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");

module.exports.index = async (req,res)=> {
        const listingdatas = await listing.find({});
        res.render("./listing/index.ejs",{listingdatas});    
}

module.exports.renderNewForm = (req,res) => {
    res.render("./listing/new.ejs");
}

module.exports.showListing = async (req,res) => {
    const {id} = req.params;
    const listings = await listing.findById(id).populate({path:"reviews",populate: {path:"author"}}).populate("owner");
    if(!listings)
    {
        req.flash("error","listing your requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listings);
    return res.render("./listing/show.ejs", { listings });   
}

module.exports.createListing = async (req,res, next) => {
    let result = listingSchema.validate(req.body); 
    console.log(result);
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings",);
}

module.exports.renderEditForm = async (req,res, next) => {
    let result = listingSchema.validate(req.body); 
    console.log(result);
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings",);
}

module.exports.updateListing = async (req,res, next) => {
    if ( !req.body || !req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated successfully");
    return res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) =>
{
        let {id} = req.params;
        let deletedlisting = await listing.findByIdAndDelete(id);
        console.log(deletedlisting);
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
}