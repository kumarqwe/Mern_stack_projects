const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isowner, validatelisting} = require("../middleware.js");
const listingController = require("../controllers/listing.js")

router.route("/")
.get(wrapAsync(listingController.index)) // all listings data
.post(validatelisting, 
    wrapAsync(listingController.createListing)); //Create Route

// New Route
router.get("/new",
    isLoggedIn, 
    listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing)) // show route for a single listing
.put(
    isLoggedIn,
    isowner,
    wrapAsync(listingController.updateListing) //Update Route
)
.delete(
    isLoggedIn,
    isowner,
    wrapAsync(listingController.destroyListing) //delete Route
);

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(listingController.renderEditForm));


module.exports = router;