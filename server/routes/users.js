const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("../utils/middleware");

router.post(
  "/register",
  catchAsync(async (req, res) => {
    //TODO: change to bcrypt version:
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.send("invalid input");
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      username: username,
      hashedPassword: hash,
      isAdmin: false,
    });
    await user.save();
    req.session.user_id = user._id;
    console.log("req.session", req.session);
    console.log("new user:", user);
    return res.status(200).json({
      status: 200,
      currentUser: user,
      message: "Regiter successfully",
    });
  })
);

router.post(
  "/login",
  catchAsync(async (req, res) => {
    //first check if the client input is valid
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log("user:", user);
    if (!user) {
      console.log("Cannot find the user!");
      res.send("invalid username or password");
    }
    //then shoule check if the user is already signed in
    if (req.session.user_id) {
      return res.status(400).json({
        status: 400,
        message: "You already signed In!",
      });
    }
    //bcrypt.compare(): first argument plain password and 2nd argument is hashed password
    const validPsw = await bcrypt.compare(password, user.hashedPassword);
    if (validPsw) {
      req.session.user_id = user._id;
      return res.status(200).json({
        status: 200,
        currentUser: user,
        message: "Login successfully",
      });
    } else {
      res.send("Failed Login, plz try again");
    }
  })
);

router.post(
  "/logout",
  isAuthenticated,
  catchAsync((req, res) => {
    req.session.destroy();
    console.log("/logout post: req.session:", req.session);
    res.status(200).json({
      status: 200,
      message: "LogOut!",
    });
  })
);

router.get(
  "/plans",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.session.user_id).populate("plans");
    console.log("all plans of currentUser:", user.plans);
    res.send(user.plans);
  })
);

router.get(
  "/fishingspots",
  isAuthenticated,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.session.user_id).populate(
      "fishingspots"
    );
    //console.log("all spots of currentUser:", user.fishingspots);
    res.send(user.fishingspots);
  })
);

module.exports = router;
