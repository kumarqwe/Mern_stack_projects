const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isowner, validatelisting} = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route("/")
.get(wrapAsync(listingController.index)) // all listings data
// .post(validatelisting, 
//     wrapAsync(listingController.createListing)); //Create Route
.post(upload.single('listing[image]'), async(req,res) => {
    console.log(req.file);
    res.send(req.file);
})

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