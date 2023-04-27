import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "A partner should has a name"],
    },
    icon: {
      type: String,
      require: [true, "A partner should has its icon"],
    },
    link: {
      type: String,
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
