const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  title: String,
  description: String,
  people: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Fishingspot",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Plan", PlanSchema);
