const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordLocalmongoose = require("passport-local-mongoose");
const userSchema = Schema({
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passwordLocalmongoose);

module.exports = mongoose.model("user", userSchema);