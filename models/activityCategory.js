import mongoose from "mongoose";

const activityCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An activity category should has a name"],
      maxLength: 50,
    },
    img: {
      type: String,
      required: [true, "An activity category should has a avatar"],
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

const activityCategory = mongoose.model("activityCategory", activityCategorySchema);

module.exports = activityCategory;
