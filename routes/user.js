const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req,res) => {
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res) => {
    try {
      let {username, email, password} = req.body;
      const newUser = new User({email, username});
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser , (err) => {
        if(err) {
            next(err);
        }
      })
      req.flash("success","welcome to Wanderlust");
      res.redirect("/listings");
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}))

router.get("/login", (req,res) => {
    res.render("./users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req,res) => {
        req.flash("success","Welcome to Wanderlust! You are logged in!");
        res.redirect("/listings");
    }
);

//logout route
router.get("/logout", (req,res) =>
{
    req.logout((err) => {
        if(err)
        {
            return next(err);
        }
    });
    res.flash("success","successfully logged from wanderland");
    res.render("/listings");
});

module.exports = router;