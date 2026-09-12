const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isreviewowner,validatereview } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// reveiw submit route
router.post("/",isLoggedIn,validatereview, wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isreviewowner, wrapAsync(reviewController.destroyReview));

module.exports = router;