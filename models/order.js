import mongoose from "mongoose";
import validator from "validator";

const orderSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An order should has an owner"],
    },
    currency: {
      type: String,
      required: [true, "An order should has a currency type"],
    },
    amount: {
      type: Number,
      required: [true, "An order should has an amount for total cost"],
      validate: [
        (value) => validator.isNumeric(value.toString()),
        "Amount should only contain number",
      ],
    },
    detail: [
      {
        activityId: {
          type: mongoose.Types.ObjectId,
          ref: "Activity",
          required: [true, "An order detail should has an activityId"],
        },
        ticketTypeId: {
          type: mongoose.Types.ObjectId,
          ref: "TicketType",
          required: [true, "An order detail should has a ticketTypeId"],
        },
        ticketIds: {
          type: [mongoose.Types.ObjectId],
          ref: "TicketList",
        },
      },
    ],
    deletedAt: { type: Date, select: false },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
