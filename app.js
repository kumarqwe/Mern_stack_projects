const mongoose = require("mongoose");
const listing = require("./Models/listing.js");
const express = require("express");
const app = express();
const initatedata = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

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


// all listings data
app.get("/listings", async (req,res)=> {
    try {
        const listingdatas = await listing.find({});
        res.render("./listing/index.ejs",{listingdatas});
    } catch(err) {
        res.send("something went wrong for index route");
    }
    
})

// show route for a single listing
app.get("/listings/:id", async (req,res) => {
    try {
           const {id} = req.params;
    const listings = await listing.findById(id);
    res.render("./listing/show.ejs", { listings });
    } catch(err) {
        res.send("something went wrong for edit route");
    }
    
});

// New Route
app.get("/listing/new", (req,res) => {
    try {
        res.render("./listing/new.ejs");
    } catch(err) {
        res.send("something went wrong for new route");
    }
})

//Create Route
app.post("/listings", async (req,res, next) => {
    try {
        const newListing = new listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    } catch(err) {
        next(err);
    }
})

//Edit Route
app.get("/listings/:id/edit", async (req,res, next) => {
    try { 
        const {id} = req.params;
    const listings = await listing.findById(id);
    res.render("./listing/edit.ejs", { listing: listings });
    } catch(err) {
        next(err);
    }
    
});

//Update Route
app.put("/listings/:id", async (req,res, next) => {
    try {
        let {id} = req.params;
        await listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect(`/listings/${id}`);
    } catch(err) {
        next(err);
    }
});

// Delete Route
app.delete("/listings/:id", async (req,res) =>
{
    try {
        let {id} = req.params;
        let deletedlisting = await listing.findByIdAndDelete(id);
        console.log(deletedlisting);
        res.redirect("/listings");
    } catch(err) {
        res.send("something went wrong for delete route");
    }
});

// Error handling middleware
app.use((err,req, res, next) => {
    res.send("something went wrong");
});



// server listing on it 
app.listen(8080, () => {
    console.log("server is running on port 8080");
})