const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const listing = require("../Models/listing.js");
const Review  = require("../Models/review.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn, isreviewowner } = require("../middleware.js");

const validatereview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if( error) 
    {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errmsg);
    }
    else
    {
        next();
    }
};

// reveiw submit route
router.post("/",isLoggedIn,validatereview, wrapAsync(async(req,res) =>
{
    let listings = await listing.findById(req.params.id);
    let newReview = await new  Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listings.reviews.push(newReview);
   
    await newReview.save();
    await listings.save();
    console.log("new review saved");
    req.flash("success", "Review created successfully");
    res.redirect(`/listings/${listings._id}`);
}));

// delete review route
router.delete("/:reviewId",isLoggedIn,isreviewowner, wrapAsync(async(req,res) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;