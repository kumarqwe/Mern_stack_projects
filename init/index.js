const mongoose = require("mongoose");
const listing = require("./Models/listing.js");
const initatedata = require("./data.js");

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

const initDB = async () =>  {
    listing.deleteMany({});
    listing.insertMany(initatedata.data);
    console.log("data was added successfull");

}

initDB();