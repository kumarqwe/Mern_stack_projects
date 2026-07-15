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
        type : Schema.Types.Mixed,
        default : defaultImage,
        set : (v) => {
            if (typeof v === "string") {
                return v.trim() === "" ? defaultImage : v;
            }
            if (v && typeof v === "object" && typeof v.url === "string") {
                return v.url;
            }
            return defaultImage;
        }
    },
    price: Number,
    location: String,
    country: String
})

const Listing = mongoose.model("listing",listingschema);

module.exports = Listing;