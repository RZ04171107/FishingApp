const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Fishingspot = require("../models/fishingspot");
const Review = require("../models/review");
const { isAuthenticated, isReviewAuthor } = require("../utils/middleware");

router.post(
  "/",
  isAuthenticated,
  catchAsync(async (req, res) => {
    console.log("review req body:", req.body);
    // a review must have a body which the user wrote in the textarea
    if (!req.body.body || !req.body.rating)
      throw new ExpressError("Invalid Review", 400);
    const { _id } = req.params;
    // first find the fishing spot that link to this review
    const fishingspot = await Fishingspot.findById(_id);
    console.log("fishing spot for reviews:", fishingspot);
    //then create review
    const review = new Review(req.body);
    // add author to the review
    review.author = req.session.user_id;
    //push the new review to the reviews array of fishingspot
    fishingspot.reviews.push(review);
    await review.save();
    await fishingspot.save();
    res.send(fishingspot);
  })
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    console.log("params:", req.params);
    const { _id, reviewId } = req.params;
    // remove the review from the reviews array of fishingspot
    await Fishingspot.findByIdAndUpdate(_id, { $pull: { reviews: reviewId } });
    // delete the review
    await Review.findByIdAndDelete(reviewId);
    res.send("Delete!!!");
  })
);

module.exports = router;
