const mongoose = require("mongoose");
const listing = require("./Models/listing.js");
const express = require("express");
const app = express();
const initatedata = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review  = require("./Models/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"Views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

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


// all listings data
app.get("/listings", async (req,res)=> {
        const listingdatas = await listing.find({});
        res.render("./listing/index.ejs",{listingdatas});    
});

// show route for a single listing
app.get("/listings/:id", async (req,res) => {
    const {id} = req.params;
    const listings = await listing.findById(id).populate("reviews");
    res.render("./listing/show.ejs", { listings });   
});

// New Route
app.get("/listing/new", (req,res) => {
    res.render("./listing/new.ejs");
});

//Create Route
app.post("/listings",validatelisting, wrapAsync(async (req,res, next) => {
    let result = listingSchema.validate(req.body); 
    console.log(result);
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", async (req,res, next) => {
    const {id} = req.params;
    const listings = await listing.findById(id);
    res.render("./listing/edit.ejs", { listing: listings });    
});

//Update Route
app.put("/listings/:id", wrapAsync(async (req,res, next) => {
    if ( !req.body || !req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res) =>
{
        let {id} = req.params;
        let deletedlisting = await listing.findByIdAndDelete(id);
        console.log(deletedlisting);
        res.redirect("/listings");
})
);

// reveiw submit route
app.post("/listings/:id/reviews",validatereview, async(req,res) =>
{
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    console.log("new review saved");
    res.redirect(`/listings/${listings._id}`);
});

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