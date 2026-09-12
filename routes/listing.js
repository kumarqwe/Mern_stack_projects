const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");4
const listing = require("../Models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn, isowner, validatelisting} = require("../middleware.js");
const listingController = require("../controllers/listing.js")

// all listings data
router.get("/", listingController.index);

// New Route
router.get("/new",
    isLoggedIn, 
    listingController.renderNewForm);

// show route for a single listing
router.get("/:id", 
    wrapAsync(listingController.showListing));

//Create Route
router.post("/",
    validatelisting, 
    wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id",
    isLoggedIn,
    isowner,
    wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete("/:id",
    isLoggedIn,
    isowner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;