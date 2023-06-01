import mongoose from "mongoose";

const systemNoticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A system notice should has a title"],
    },
    content: {
      type: String,
      required: [true, "A system notice should has a content"],
    },
    publishAt: {
      type: Date,
      required: [true, "An system notice should has a release date"],
    },
    expiredAt: {
      type: Date,
      required: [true, "An system notice should has a expiration date"],
      validate: [
        function (val) {
          return val >= this.publishAt;
        },
        "Expiration date should expirate after publish",
      ],
    },
    deletedAt: { type: Date, select: false },
    __v: { type: Number, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
systemNoticeSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

systemNoticeSchema.virtual("isPublished").get(function () {
  return this.publishAt < Date.now();
});

systemNoticeSchema.virtual("isExpired").get(function () {
  return this.expiredAt < Date.now();
});

const SystemNotice = mongoose.model("SystemNotice", systemNoticeSchema);

export default SystemNotice;
