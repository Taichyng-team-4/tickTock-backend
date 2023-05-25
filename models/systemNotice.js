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
    __v: { type: Number, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
systemNoticeSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});
systemNoticeSchema
  .virtual("isPublished")
  .get(function(){
    this.publishAt < Date.now()
  });
systemNoticeSchema.virtual("isExpired").get(function(){
  this.expiredAt > Date.now()
});

const SystemNotice = mongoose.model("SystemNotice", systemNoticeSchema);

export default SystemNotice;
