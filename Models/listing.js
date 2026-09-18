const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImage =
  "https://images.pexels.com/photos/31284696/pexels-photo-31284696.jpeg?cs=srgb&dl=pexels-optical-chemist-340351297-31284696.jpg&fm=jpg";

const listingschema = new Schema({
    title: {
        type : String,
        required:true
    },
    description : String,
    image: {
        url: String,
        filename:String
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
         type : Schema.Types.ObjectId,
         ref : "Review",
        },
    ],
    owner: {
        type : Schema.Types.ObjectId,
        ref  : "user",
    },
    geometry : {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
    
})

const Listing = mongoose.model("listing",listingschema);

module.exports = Listing;