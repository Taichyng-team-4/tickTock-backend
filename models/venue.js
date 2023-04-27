import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A venue should has a name"],
      maxLength: 250,
      unique: true,
    },
    capacity: Number,
    address: {
      type: String,
      required: [true, "A venue should has an address"],
    },
    venueImg: {
      type: String,
      default: "",
    },
    seatMapImg: {
      type: String,
      default: "",
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
