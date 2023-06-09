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
          ref: "Ticket",
        },
        ticketListIds: {
          type: [mongoose.Types.ObjectId],
          ref: "TicketList",
        },
      },
    ],
    paymentUrl: {
      type: String,
      select: false,
      validate: [validator.isURL, "The payment url should be an url"],
    },
    transactionId: { type: String, select: false },
    expiredAt: { type: Date },
    deletedAt: { type: Date },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

orderSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getExpired))
    this.where({ expiredAt: null });
});

orderSchema.virtual("isExpired").get(function () {
  if (!this.expiredAt) return false;
  return this.expiredAt < Date.now();
});

orderSchema.virtual("isTrading").get(function () {
  if (!this.expiredAt) return false;
  return Date.now() > this.expiredAt;
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
