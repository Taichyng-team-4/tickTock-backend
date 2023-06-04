import mongoose from "mongoose";
import validator from "validator";

const activitySchema = new mongoose.Schema(
  {
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
    settingId: {
      type: mongoose.Types.ObjectId,
      ref: "ActivitySetting",
      required: [true, "An activity should has its setting"],
    },
    ticketTypeIds: [{
      type: mongoose.Types.ObjectId,
      ref: "TicketType",
    }],
    category: {
      type: String,
      enum: {
        values: ["music", "sport", "drama", "art", "sport", "exhibition"],
        message:
          "An activity category should be music, sport, drama, art, sport or exhibition",
      },
      default: "anonymous",
    },
    name: {
      type: String,
      required: [true, "An activity should has a name"],
      minLength: [1, "An activity name should longer than 1 characters"],
      maxLength: [
        250,
        "An activity name should not longer than 250 characters",
      ],
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
        "Start date should be in the future",
      ],
    },
    endAt: {
      type: Date,
      required: [true, "An activity should has an end date"],
      validate: [
        function (val) {
          return val > Date.now();
        },
        "End date should be in the future",
      ],
    },
    deletedAt: { type: Date, select: false },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

activitySchema.index({ name: 1, deletedAt: 1 }, { unique: true });

activitySchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

activitySchema.virtual("isPublished").get(function () {
  if (!this.publishAt) return false;
  return this.publishAt < Date.now();
});

activitySchema.virtual("isStart").get(function () {
  return this.startAt < Date.now();
});

activitySchema.virtual("isEnd").get(function () {
  return this.endAt < Date.now();
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
