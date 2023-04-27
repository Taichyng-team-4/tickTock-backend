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
    isExpired: { type: Boolean, default: false },
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

const SystemNotice = mongoose.model("SystemNotice", systemNoticeSchema);

module.exports = SystemNotice;
