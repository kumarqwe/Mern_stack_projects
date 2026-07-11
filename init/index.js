const mongoose = require("mongoose");
const listing = require("../Models/listing.js");
const express = require("express");
const app = express();
const initatedata = require("./data.js");
const path = require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"..","Views"));
app.use(express.urlencoded({extended:true}));

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
    const listingdatas = await listing.find({});
    res.render("./listing/index.ejs",{listingdatas});
})

// show route for a single listing
app.get("/listings/:id", async (req,res) => {
    const {id} = req.params;
    const listings = await listing.findById(id);
    res.render("./listing/show.ejs", { listings });
});

// create route for new listing
app.get("/listing/new", (req,res) => {
    res.render("./listing/create.ejs");
})

// server listing on it 
app.listen(8080, () => {
    console.log("server is running on port 8080");
})