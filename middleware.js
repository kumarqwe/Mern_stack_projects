const listing = require("./Models/listing.js");
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