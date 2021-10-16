const mongoose = require("mongoose");
const Fishingspot = require("../models/fishingspot");
const User = require("../models/user");
const cities = require("./cities_CA.json");
const { places, descriptors } = require("./seedHelpers");
const bcrypt = require("bcrypt");

const ADMIN_ID = "6165f539c231b02f29e68209";

mongoose.connect("mongodb://localhost:27017/FishingApp", {
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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

//create the first user: ingrid
const createAdmin = async () => {
  await User.deleteMany({});
  const password = "ingrid";
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    email: "ingrid@gmail.com",
    username: "ingrid",
    hashedPassword: hash,
    isAdmin: true,
  });
  await user.save();
};

// create some random fishing spots
const seedDB = async () => {
  //  delete everything in the database
  await Fishingspot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * 1738); //since cities.length === 1738
    const peopleNum = Math.floor(Math.random() * 10) + 2;

    const spot = new Fishingspot({
      author: ADMIN_ID,
      location: `${cities[randomIndex].city}, ${cities[randomIndex].province_name}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/2080625",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper scelerisque mi non tincidunt. Donec vulputate nisl augue, nec tincidunt enim eleifend ut. Suspendisse potenti. Phasellus sit amet diam convallis, tempus neque eget, commodo ipsum.",
      people: peopleNum,
      geometry: {
        type: "Point",
        coordinates: [cities[randomIndex].lng, cities[randomIndex].lat],
      },
    });
    await spot.save();

    //push the random fishing spot to admin's fishingspots list
    const user = await User.findById(ADMIN_ID);
    user.fishingspots.push(spot);
    await user.save();
  }
};

// createAdmin().then(() => {
//   mongoose.connection.close();
// });

seedDB().then(() => {
  mongoose.connection.close();
});
