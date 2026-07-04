const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const Listing = require("./Models/listing.js");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"Views"));
app.use(express.urlencoded({extended: true}))

const MONGO_URL = "mongodb+srv://savarapuprasanthkumar2002_db_user:H5Tfb5jUSCn0YE4U@mernstack.iayfcgn.mongodb.net/?appName=Mernstack";

// main().then( () => {
//     console.log("connection successfull");
// }).catch( (err) =>
// {
//     console.log(`this was the error ${err}`);
// })

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.get("/", (req,res) => {
    res.send("this is mern stack project");
});

// app.get("/testlisting", async (req,res) => {

//     const testlisting = new Listing({
//         title : "kumar",
//         description: "normal about prasanth",
//         price : 30,
//         location :"andhrapradesh",
//         country:"india"
//     });

//     await testlisting.save()
//     comsole.log("saved the data");
//     res.send("data was added to db");
// })
 
 //Index Route
app.get("/listings", async (req,res) =>
{
    const listingdatas = await Listing.find({});
    res.render("listing/index.ejs",{listingdatas});
})


// Show Route
app.get("/listings/:id" , async (req,res) =>
{
    let {id}  = req.params;

    let listing = await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
})


app.listen(8080 , () =>
{
    console.log("server listening to 8080 port");
});