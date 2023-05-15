import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An order should has an owner"],
    },
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: "Activity",
      required: [true, "An order should has an activityId"],
    },
    finance_info: {
      type: String,
      require: [true, "An order should has its transaction number"],
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

const order = mongoose.model("Order", orderSchema);

module.exports = order;
