"use strict";

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET || "mongo";
const port = process.env.PORT || 8000;
//const dbUrl = "mongodb://localhost:27017/FishingApp";
const MongoStore = require("connect-mongo");

const fishingspotRoutes = require("./routes/fishingspot");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const planRoutes = require("./routes/plans");
const adminRoutes = require("./routes/admin");
const app = express();

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600, //time period in seconds
  }),
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 3600 * 24 * 7, //will expire after a week, in case that user signed in and staying login forever
    maxAge: 1000 * 3600 * 24 * 7,
    httpOnly: true, //for security
  },
};

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

//--------------------CONNECT TO DATABASE-----------------
//"mongodb://localhost:27017/FishingApp"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//NEED TO OPEN mongo in the background!
//brew services start mongodb-community@5.0
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});
//--------------------END OF CONNECTION-------------------

//--------------------MIDDLEWARES PART--------------------
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, HEAD, GET, PUT, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(__dirname + "/"));
app.use(express.json());
app.use(flash());
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app was connecting to, try to kill the Proxy error in the console
    credentials: true,
  })
);

app.use(session(sessionConfig));
app.use(cookieParser("mongo"));

app.use("/fishingspots", fishingspotRoutes);
app.use("/fishingspots/:_id/reviews", reviewRoutes);
app.use("/user", userRoutes);
app.use("/plans", planRoutes);
app.use("/admin", adminRoutes);

//for testing
app.use((req, res, next) => {
  console.log("@@ req.session.user_id:", req.session.user_id);
  next();
});

//--------------------END OF MIDDLEWARES-------------------

//--------------------START OF ROUTES----------------------
app.get("/test", (req, res) => {
  res.send("Hello from fishing app");
});

app.get("/getauth", async (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({
      status: 401,
      message: "No user logged in",
    });
  }
  const user = await User.findById(req.session.user_id);
  return res.status(200).json({
    status: 200,
    message: "Find current logged in user",
    currentUser: user,
  });
});

app.post("/sendemail", async (req, res) => {
  const options = {
    from: "rz04171107@outlook.com",
    to: "ingridcyou@gmail.com",
    subject: "Sending email from nodejs",
    text: "test!",
  };
  await transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Sent: " + info.response);
  });
  res.send("send email");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//also middleware: this cannot be put in front of the routes
app.use((error, req, res, next) => {
  const { statusCode = 500, message = "Oh Boy, something went wrong" } = error; //set default error message
  res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log("Serving on port :", port);
});
