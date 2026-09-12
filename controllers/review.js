const listing = require("../Models/listing.js");
const Review  = require("../Models/review.js");

module.exports.createReview = async(req,res) =>
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
}

module.exports.destroyReview = async(req,res) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}