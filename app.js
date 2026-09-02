const mongoose = require("mongoose");
const listing = require("./Models/listing.js");
const express = require("express");
const app = express();
const initatedata = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const routerlisting = require("./routes/listing.js");
const routerreview = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"Views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res, next) => {
    res.locals.success = req.flash("success");
    next();
})
app.use("/listings/:id/reviews", routerreview);
app.use("/listings", routerlisting);

app.engine("ejs",ejsmate);


if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = require("crypto").webcrypto;
}
const MONGO_URL = "mongodb://127.0.0.1:27017/mernstack";

main().then( () => {
    console.log("connection successful");
}).catch( (err) =>
{
    console.log(`this was the error ${err}`);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>  {
    await listing.deleteMany({});
    await listing.insertMany(initatedata.data);
    console.log("data was added successfully");
}

initDB().catch((err) => console.error(err));


// for all invalid routes
app.all(/.*/, (req,res, next) => {
    next(new ExpressError(404, "page not found"));
});


// Error handling middleware
app.use((err,req, res, next) => {
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("./listing/Error.ejs",{err});
    // res.status(statusCode).send(message);
});

// server listing on it 
app.listen(8080, () => {
    console.log("server is running on port 8080");
})