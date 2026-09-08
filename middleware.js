module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated())
    {
        req.flash("error","please login to perform this action");
        res.redirect("/login");
    }
    next();
}