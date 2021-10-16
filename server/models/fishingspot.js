const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FishingspotSchema = new Schema({
  title: String,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  image: String,
  people: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Fishingspot", FishingspotSchema);
