const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Fishingspot = require("../models/fishingspot");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const User = require("../models/user");
const Plan = require("../models/plan");
const { isAuthenticated, isFishingspotAuthor } = require("../utils/middleware");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken }); //contains 2 functions, forwardGeocode() & reverseGeocode()

router.get(
  "/",
  catchAsync(async (req, res) => {
    const spots = await Fishingspot.find({});
    res.send(spots);
  })
);

router.get(
  "/:_id",
  catchAsync(async (req, res) => {
    const spot = await Fishingspot.findById(req.params._id)
      //need to populate the author of every review
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      // populate the author of this fishing spot
      .populate("author");
    //console.log("fishing spot:(populate check)", spot);
    res.send(spot);
  })
);

router.put(
  "/edit/:_id",
  isAuthenticated,
  isFishingspotAuthor,
  catchAsync(async (req, res) => {
    console.log("put body:", req.body);
    const { _id } = req.params;
    const spot = await Fishingspot.findByIdAndUpdate(
      _id,
      { ...req.body },
      { new: true }
    );
    res.send(spot);
  })
);

router.delete(
  "/:_id",
  isAuthenticated,
  isFishingspotAuthor,
  catchAsync(async (req, res) => {
    const { _id } = req.params;
    // remove the fishingspot from the fishingspots array of user
    await User.findByIdAndUpdate(req.session.user_id, {
      $pull: { fishingspots: _id },
    });
    // delete the fighingspot
    await Fishingspot.findByIdAndDelete(_id);
    res.send("Delete the fishing spot");
  })
);

router.post(
  "/new",
  isAuthenticated,
  catchAsync(async (req, res, next) => {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
    // geoData.body.features[0].geometry.coordinates

    const fishingspot = new Fishingspot(req.body);
    //add on geometry
    fishingspot.geometry = geoData.body.features[0].geometry;
    //add author to all new fishing spot
    fishingspot.author = req.session.user_id;
    console.log("new:", fishingspot);
    await fishingspot.save();

    // get current user and push the new fishing spot to user's fishingspots array
    const user = await User.findById(req.session.user_id);
    console.log("author user of the new fishingspot:", user);
    user.fishingspots.push(fishingspot);
    await user.save();
    res.send("New fishing spot added");
  })
);

router.post(
  "/:_id/plans/new",
  isAuthenticated,
  catchAsync(async (req, res) => {
    console.log(req.body, "plan post body:");
    const { _id } = req.params;
    console.log(_id, "fishing spot _id:");
    const plan = new Plan(req.body);
    plan.author = req.session.user_id;
    plan.location = _id;

    //need to add the newly created plan to the author user:
    const user = await User.findById(req.session.user_id);
    console.log("author user of the new fishingspot:", user);
    user.plans.push(plan);
    await user.save();
    //TODO: add the author himself/herself to the participants array
    plan.participants.push(user);

    console.log("new plan:", plan);
    await plan.save();

    return res.status(200).json({
      status: 200,
      data: plan,
      message: "New fishing plan submitted!",
    });
  })
);

module.exports = router;
