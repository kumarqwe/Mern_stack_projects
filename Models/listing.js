const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({
    title: {
        type : String,
        required:true
    },
    description : String,
    image: {
        type : String,
        default : "https://images.pexels.com/photos/31284696/pexels-photo-31284696.jpeg?cs=srgb&dl=pexels-optical-chemist-340351297-31284696.jpg&fm=jpg",
        set : (v) => v ===""? "https://images.pexels.com/photos/31284696/pexels-photo-31284696.jpeg?cs=srgb&dl=pexels-optical-chemist-340351297-31284696.jpg&fm=jpgnk":v
    },
    price: Number,
    location: String,
    country: String
})

const Listing = mongoose.model("listing",listingschema);

module.exports = Listing;