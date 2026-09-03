const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");4
const listing = require("../Models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");

const validatelisting = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if( error) 
    {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    else
    {
        next();
    }
};

// all listings data
router.get("/", async (req,res)=> {
        const listingdatas = await listing.find({});
        res.render("./listing/index.ejs",{listingdatas});    
});

// New Route
router.get("/new", (req,res) => {
    res.render("./listing/new.ejs");
});

// show route for a single listing
router.get("/:id", async (req,res) => {
    const {id} = req.params;
    const listings = await listing.findById(id).populate("reviews");
    if(!listings)
    {
        req.flash("error","listing your requested for does not exist")
        res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listings });   
});

//Create Route
router.post("/",validatelisting, wrapAsync(async (req,res, next) => {
    let result = listingSchema.validate(req.body); 
    console.log(result);
    const newListing = new listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing created successfully");
    res.redirect("/listings",);
}));

//Edit Route
router.get("/:id/edit", async (req,res, next) => {
    const {id} = req.params;
    const listings = await listing.findById(id);
    if(!listings)
    {
        req.flash("error","listing your requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listing/edit.ejs", { listing: listings });    
});

//Update Route
router.put("/:id", wrapAsync(async (req,res, next) => {
    if ( !req.body || !req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
})
);

// Delete Route
router.delete("/:id", wrapAsync(async (req,res) =>
{
        let {id} = req.params;
        let deletedlisting = await listing.findByIdAndDelete(id);
        console.log(deletedlisting);
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
})
);

module.exports = router;