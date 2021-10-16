const express = require("express");
const router = express.Router();
const Plan = require("../models/plan");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { isAuthenticated, isPlanAuthor } = require("../utils/middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const plans = await Plan.find({});
    res.send(plans);
  })
);

router.get(
  "/:_id",
  catchAsync(async (req, res) => {
    const plan = await Plan.findById(req.params._id)
      .populate("participants")
      .populate("author")
      .populate("location");

    console.log("fishing plan:(populate check)", plan);
    res.send(plan);
  })
);

router.put(
  "/edit/:_id",
  isAuthenticated,
  isPlanAuthor,
  catchAsync(async (req, res) => {
    console.log("put plan req.body :", req.body);
    const { _id } = req.params;
    const plan = await Plan.findByIdAndUpdate(
      _id,
      { ...req.body },
      { new: true }
    );
    res.send(plan);
  })
);

router.delete(
  "/:_id",
  isAuthenticated,
  isPlanAuthor,
  catchAsync(async (req, res) => {
    const { _id } = req.params;
    //await Plan.findByIdAndDelete(_id);
    // remove the plan from the plans array of user
    await User.findByIdAndUpdate(req.session.user_id, {
      $pull: { plans: _id },
    });
    // delete the plan
    await Plan.findByIdAndDelete(_id);
    res.send("Delete the fishing plan");
  })
);

router.post(
  "/:_id/participate",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const plan = await Plan.findById(req.params._id);
    //find current user and push current user to the participants list
    const user = await User.findById(req.session.user_id);
    //console.log("server participants list: ", plan.participants);
    //console.log("participate post user:", user);
    //TODO: if the user is not in the participants list && plan has space
    if (
      !plan.participants.includes(user) &&
      plan.participants.length < plan.people
    ) {
      plan.participants.push(user);
      await plan.save();
      res.send("Participation Success");
    }
    res.send("Participation Error");
  })
);

module.exports = router;
