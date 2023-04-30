import mongoose from "mongoose";
import validator from "validator";

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
      minLength: [1, "An activity name should longer than 1 characters"],
      maxLength: [
        250,
        "An activity name should not longer than 250 characters",
      ],
      unique: true,
    },
    themeImg: {
      type: String,
      required: [true, "An activity should has a theme img"],
      validate: [validator.isURL, "The activity theme image should be an url"],
    },
    description: {
      type: String,
      required: [true, "An activity should has a description"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "An activity should has a summary"],
      trim: true,
    },
    publishAt: {
      type: Date,
      validate: [
        function (val) {
          return val < Date.now();
        },
        "Pleas provide a valid publish date",
      ],
    },
    startAt: {
      type: Date,
      required: [true, "An activity should has a start date"],
      validate: [
        function (val) {
          return val > Date.now();
        },
        "Pleas provide a valid start date",
      ],
    },
    endAt: {
      type: Date,
      required: [true, "An activity should has a end date"],
      validate: [
        function (val) {
          return val > Date.now();
        },
        "Pleas provide a valid end date",
      ],
    },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

activitySchema.virtual("isPublished").get(() => {
  if (!this.publishAt) return false;
  return this.publishAt < Date.now();
});

activitySchema.virtual("isStart").get(() => this.startAt > Date.now());
activitySchema.virtual("isEnd").get(() => this.endAt > Date.now());

const Activity = mongoose.model("activitySchema", activitySchema);

module.exports = Activity;
