import mongoose from "mongoose";
import validator from "validator";

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "A partner should has a name"],
      minLength: [1, "A partner name should longer than 1 characters"],
      maxLength: [250, "A partner name should not longer than 250 characters"],
    },
    icon: {
      type: String,
      require: [true, "A partner should has its icon"],
      validate: [validator.isURL, "The partner icon should be an url"],
    },
    link: {
      type: String,
      validate: [validator.isURL, "The partner link should be an url"],
    },
    deletedAt: { type: Date, select: false },
    __v: { type: Number, select: false },
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
