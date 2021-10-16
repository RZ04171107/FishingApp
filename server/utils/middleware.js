const Fishingspot = require("../models/fishingspot");
const Plan = require("../models/plan");
const Review = require("../models/review");
const ADMIN_ID = "6165f539c231b02f29e68209";

module.exports.isAuthenticated = (req, res, next) => {
  console.log("@@ req.session.user_id:", req.session.user_id);
  if (!req.session.user_id) {
    console.log("AUTH FAILED!");
    return res.status(401).json({
      status: 401,
      message: "Authentication Failed",
    });
  }
  next();
};

module.exports.isFishingspotAuthor = async (req, res, next) => {
  const { _id } = req.params;
  const fishingspot = await Fishingspot.findById(_id);
  if (!fishingspot.author.equals(req.session.user_id)) {
    res.send("You do not have the permission to do that!");
  }
  next();
};

module.exports.isPlanAuthor = async (req, res, next) => {
  const { _id } = req.params;
  const plan = await Plan.findById(_id);
  if (!plan.author.equals(req.session.user_id)) {
    res.send("You do not have the permission to do that!");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { _id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (review.author !== req.session.user_id) {
    res.send("You do not have the permission to do that!");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  console.log("@@ ADMIN_ID:", ADMIN_ID);
  if (req.session.user_id !== ADMIN_ID) {
    console.log("ADMIN AUTH FAILED");
    return res.status(401).json({
      status: 401,
      message: "AUTH FAILED: NOT ADMIN",
    });
  }
  next();
};
