const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    created_At : {
        type : Date,
        Default : Date.now()
    }
});

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;