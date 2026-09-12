const User = require("../Models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup = async(req,res,next) => {
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
}

module.exports.renderLoginForm = (req,res) => {
    res.render("../Views/users/login.ejs");
}

module.exports.login = async (req,res) => {
        req.flash("success","Welcome to Wanderlust! You are logged in!");
        console.log("userdetails");
         console.log(req.user);
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) =>
{
    req.logout((err) => {
        if(err)
        {
            return next(err);
        }
        req.flash("success","successfully logged from wanderland");
        return res.redirect("/listings");
    });
}
