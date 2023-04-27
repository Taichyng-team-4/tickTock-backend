import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An activity should has an owner"],
    },
    orgId: {
      type: mongoose.Types.ObjectId,
      ref: "Org",
      required: [true, "An activity should has an organization"],
    },
    venueId: {
      type: mongoose.Types.ObjectId,
      ref: "Venue",
      required: [true, "An activity should has a venue"],
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "ActivityCategory",
      required: [true, "An activity should has a category"],
    },
    settingId: {
      type: mongoose.Types.ObjectId,
      ref: "ActivitySetting",
      required: [true, "An activity should has its setting"],
    },
    name: {
      type: String,
      required: [true, "An activity should has a name"],
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
    themeImg: {
      type: String,
      required: [true, "An activity should has a theme img"],
    },
    description: {
      type: String,
      required: [true, "An activity should has a description"],
    },
    summary: {
      type: String,
      required: [true, "An activity should has a summary"],
    },
    publishAt: Date,
    startAt: {
      type: Date,
      required: [true, "An activity should has a start date"],
    },
    endAt: {
      type: Date,
      required: [true, "An activity should has a end date"],
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Activity = mongoose.model("activitySchema", activitySchema);

module.exports = Activity;
