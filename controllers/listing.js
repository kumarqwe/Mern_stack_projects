const ExpressError = require("../utils/ExpressError.js");4
const listing = require("../Models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: maptoken });


module.exports.index = async (req,res)=> {
        const listingdatas = await listing.find({});
        res.render("./listing/index.ejs",{listingdatas});    
}

module.exports.renderNewForm = (req,res) => {
    res.render("./listing/new.ejs");
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listings = await listing.findById(id);
    if(!listings)
    {
        req.flash("error","listing your request for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listings.image.url;
    originalImageUrl = originalImageUrl.replace(
        "/upload/",
        "/upload/c_thumb,g_face,h_200,w_200/r_max/f_auto/"
    );
    res.render("./listing/edit.ejs", {listing:listings, originalImageUrl });
};

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

    let response = await geocodingClient.forwardGeocode({
       query: req.body.listing.location,
       limit: 1
   })
   .send();
    console.log(response.body.features[0].geometry);
    return res.send("done");

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings",);
}

module.exports.updateListing = async (req,res, next) => {
    if ( !req.body || !req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    const listing =await listing.findByIdAndUpdate(id, {...req.body.listing});
    if(req.file !== undefined)
    {
        let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    
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