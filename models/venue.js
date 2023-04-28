import mongoose from "mongoose";
import validator from "validator";

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A venue should has a name"],
      minLength: [1, "An venue name should longer than 1 characters"],
      maxLength: [250, "An venue name should not longer than 250 characters"],
      unique: true,
    },
    capacity: {
      type: Number,
      minLength: [1, "An venue capacity should greater than 1"],
    },
    address: {
      type: String,
      required: [true, "A venue should has an address"],
    },
    venueImg: {
      type: String,
      default: "",
      validate: [validator.isURL, "The venue image should be an url"],
    },
    seatMapImg: {
      type: String,
      default: "",
      validate: [validator.isURL, "The venue seat map should be an url"],
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
