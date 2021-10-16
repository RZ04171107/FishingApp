const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  fishingspots: [
    {
      type: Schema.Types.ObjectId,
      ref: "Fishingspot",
    },
  ],
  plans: [
    {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
