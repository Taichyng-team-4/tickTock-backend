import mongoose from "mongoose";
import validator from "validator";

const activityCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An activity category should has a name"],
      maxLength: [50, "An activity category name should not longer than 50 characters"],
    },
    img: {
      type: String,
      validate: [validator.isURL, "The activity category image should be an url"]
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

const activityCategory = mongoose.model("activityCategory", activityCategorySchema);

module.exports = activityCategory;
