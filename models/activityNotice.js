import mongoose from "mongoose";

const activityNoticeSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: "Activity",
      required: [true, "An activity notice should has an activityId"],
    },
    title: {
      type: String,
      require: [true, "An activity notice should has a title"],
    },
    content: {
      type: String,
      require: [true, "An activity notice should has a content"],
    },
    publishAt: {
      type: Date,
      require: [true, "An activity notice should has a release date"],
    },
    expiredAt: {
      type: Date,
      require: [true, "An activity notice should has a expiration date"],
    },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

activityNoticeSchema
  .virtual("isPublished")
  .get(() => this.publishAt < Date.now());
activityNoticeSchema
  .virtual("isExpired")
  .get(() => this.expiredAt > Date.now());

const ActivityNotice = mongoose.model("ActivityNotice", activityNoticeSchema);

module.exports = ActivityNotice;
