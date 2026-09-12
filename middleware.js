const listing = require("./Models/listing.js");
const Review  = require("./Models/review.js");
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","please login to perform this action");
        return res.redirect("/login");
    }
    return next();
}

module.exports.saveRedirectUrl = (req,res, next) => {
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
}

module.exports.isowner = async (req,res,next) => {
    let {id} = req.params;
        const listinging = await listing.findById(id);
        if(!listinging.owner._id.equals(res.locals.currUser._id))
        {
           req.flash("error", "you are not the owner of this listing, so you cannot update it");
           return res.redirect(`/listings/${id}`);
        }
}

module.exports.isreviewowner = async (req,res,next) => {
    let {id, reviewId} = req.params;
        const review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id))
        {
           req.flash("error", "you are not the aothor of this review");
           return res.redirect(`/listings/${id}`);
        }
}

module.exports.validatelisting = async (req,res,next) => {
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
}