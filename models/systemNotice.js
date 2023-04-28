import mongoose from "mongoose";

const systemNoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "A system notice should has a title"],
    },
    content: {
      type: String,
      require: [true, "A system notice should has a content"],
    },
    isPublish: { type: Boolean, default: false },
    publishAt: {
      type: Date,
      require: [true, "An system notice should has a release date"],
    },
    expiredAt: {
      type: Date,
      require: [true, "An system notice should has a expiration date"],
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

systemNoticeSchema
  .virtual("isPublished")
  .get(() => this.publishAt < new Date.now());
systemNoticeSchema.virtual("isExpired").get(() => this.expiredAt > new Date.now());

const SystemNotice = mongoose.model("SystemNotice", systemNoticeSchema);

module.exports = SystemNotice;
