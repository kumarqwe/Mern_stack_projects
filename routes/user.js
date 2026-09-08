const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req,res) => {
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res,next) => {
    try {
      let {username, email, password} = req.body;
      const newUser = new User({email, username});
      const registeredUser = await User.register(newUser, password);
      return req.login(registeredUser, (err) => {
        if(err) {
            return next(err); //header already sent error
        }
        req.flash("success","welcome to Wanderlust");
        return res.redirect("/listings");
      });
    }
    catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}))

router.get("/login", (req,res) => {
    res.render("../Views/users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req,res) => {
        req.flash("success","Welcome to Wanderlust! You are logged in!");
        console.log("userdetails");
         console.log(req.user);
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

//logout route
router.get("/logout", (req,res,next) =>
{
    req.logout((err) => {
        if(err)
        {
            return next(err);
        }
        req.flash("success","successfully logged from wanderland");
        return res.redirect("/listings");
    });
});

module.exports = router;