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
      required: [true, "An activity notice should has a title"],
    },
    content: {
      type: String,
      required: [true, "An activity notice should has a content"],
    },
    publishAt: {
      type: Date,
      required: [true, "An activity notice should has a release date"],
    },
    expiredAt: {
      type: Date,
      required: [true, "An activity notice should has a expiration date"],
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

activityNoticeSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

activityNoticeSchema
  .virtual("isPublished")
  .get(function(){
    return this.publishAt < Date.now()
  });

  
activityNoticeSchema
  .virtual("isExpired")
  .get(function(){
    return this.expiredAt > Date.now()
  });

const ActivityNotice = mongoose.model("ActivityNotice", activityNoticeSchema);

export default ActivityNotice;
