import mongoose from "mongoose";
import validator from "validator";

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A venue should has a name"],
      minLength: [1, "An venue name should longer than 1 characters"],
      maxLength: [250, "An venue name should not longer than 250 characters"],
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
      validate: [validator.isURL, "The venue image should be an url"],
    },
    seatMapImg: {
      type: String,
      validate: [validator.isURL, "The venue seat map should be an url"],
    },
    deletedAt: { type: Date, select: false },
    __v: { type: Number, select: false}
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

venueSchema.index({ name: 1, deletedAt: 1 }, { unique: true });

venueSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

const Venue = mongoose.model("Venue", venueSchema);

export default  Venue;
