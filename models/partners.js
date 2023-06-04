import mongoose from "mongoose";
import validator from "validator";

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A partner should has a name"],
      minLength: [1, "A partner name should longer than 1 characters"],
      maxLength: [250, "A partner name should not longer than 250 characters"],
    },
    icon: {
      type: String,
      required: [true, "A partner should has its icon"],
      validate: [validator.isURL, "The partner icon should be an url"],
    },
    link: {
      type: String,
      validate: [validator.isURL, "The partner link should be an url"],
    },
    deletedAt: { type: Date, select: false },
    __v: { type: Number, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

partnerSchema.index({ name: 1, deletedAt: 1 }, { unique: true });

partnerSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
