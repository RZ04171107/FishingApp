const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Fishingspot = require("../models/fishingspot");
const Plan = require("../models/plan");
const nodemailer = require("nodemailer");
const { isAdmin } = require("../utils/middleware");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "rz04171107@outlook.com", // generated ethereal user
    pass: process.env.OUTLOOK_PSW, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3",
  },
});

// ##########################################################
// #                                                        #
// #   Create                                               #
// #       same as other user, use POST in other routes     #
// #   Read                                                 #
// #       GET /fishingspots/ (in fishingspot route)        #
// #       GET /plans/        (in plans route)              #
// #       GET users: /admin/user/                          #
// #   Update                                               #
// #       PUT fishingspot: /admin/fs/edit/:_id             #
// #       PUT fishingplan: /admin/plan/edit/:_id           #
// #   Destroy                                              #
// #       DELETE fishingspot: /admin/fs/:_id               #
// #       DELETE fishingplan: /admin/plan/:_id             #
// #       DELETE user: /admin/user/:_id                    #
// #   Sending Emails                                       #
// #       POST  to participants:  /admin/sendemail         #
// #                                                        #
// ##########################################################

router.get(
  "/user/",
  catchAsync(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

router.delete(
  "/user/:_id",
  isAdmin,
  catchAsync(async (req, res) => {
    const { _id } = req.params;
    console.log("ready to delete user", _id);
    await User.findByIdAndDelete(_id);
    res.send("User deleted");
  })
);

router.put(
  "/plan/edit/:_id",
  isAdmin,
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
  "/plan/:_id",
  isAdmin,
  catchAsync(async (req, res) => {
    const { _id } = req.params;
    const plan = await Plan.findById(_id);
    const authorId = plan.author;
    console.log("plan authorId:", authorId);
    // remove the plan from the plans array of the author user
    await User.findByIdAndUpdate(authorId, {
      $pull: { plans: _id },
    });
    // delete the plan
    await Plan.findByIdAndDelete(_id);
    res.send("Delete the fishing plan by ADMIN");
  })
);

router.put(
  "/fs/edit/:_id",
  isAdmin,
  catchAsync(async (req, res) => {
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
  "/fs/:_id",
  isAdmin,
  catchAsync(async (req, res) => {
    const { _id } = req.params;
    const spot = await Fishingspot.findById(_id);
    const authorId = spot.author;
    // remove the fishingspot from the fishingspots array of the author
    await User.findByIdAndUpdate(authorId, {
      $pull: { fishingspots: _id },
    });
    // delete the fighingspot
    await Fishingspot.findByIdAndDelete(_id);
    res.send("Delete the fishing spot");
  })
);

router.post("/sendemail", isAdmin, async (req, res) => {
  console.log("admin sendemail req.body:", req.body);
  const { participants, content } = req.body;

  participants.forEach(async (user_id) => {
    const user = await User.findById(user_id);

    const options = {
      from: "rz04171107@outlook.com",
      to: user.email,
      subject: "Email from <FishingApp> By the admin",
      text: content,
    };
    await transporter.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Sent: " + info.response);
    });
  });

  res.send("send email");
});

module.exports = router;
