import mongoose from "mongoose";
import validator from "validator";

const ticketSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An ticket should has an customerId"],
    },
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: "Activity",
      required: [true, "An ticket should has an activityId"],
    },
    ticketTypeId: {
      type: mongoose.Types.ObjectId,
      ref: "TicketType",
      required: [true, "An ticket should has an ticketTypeId"],
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: [true, "An ticket should has an orderId"],
    },
    isValid: { type: Boolean, default: true },
    ticketTypeName: {
      type: String,
      require: [true, "A ticket should has its type name"],
    },
    zone: {
      type: Boolean,
      require: [true, "A ticket should has a zone"],
      validate: [
        validator.isAlphanumeric,
        "The zone of ticket should only contain alphabet or number.",
      ],
    },
    seatNo: {
      type: Boolean,
      require: [true, "A ticket should has a seat number"],
      validate: [
        validator.isAlphanumeric,
        "The seat number of ticket should only contain alphabet or number.",
      ],
    },
    currency: {
      type: String,
      require: [true, "A ticket should has a currency when purchase"],
      validate: [validator.isAlpha, "Currency should only contain alphabet"],
    },
    price: {
      type: Boolean,
      require: [true, "A ticket should has a price when purchase"],
      validate: [validator.isNumeric, "Price should only contain number"],
    },
    QRcode: {
      type: Boolean,
      require: [true, "A ticket should has its QRcode of the pass"],
    },
    startAt: {
      type: Date,
      require: [true, "A ticket should mark the activity start date"],
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    expiredAt: {
      type: Date,
      require: [true, "A ticket should mark the expired date"],
    },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ticketSchema.virtual("isStart").get(() => this.startAt > Date.now());
ticketSchema.virtual("isRefunded").get(() => {
  if (!this.refundedAt) return false;
  return true;
});
ticketSchema.virtual("isExpired").get(() => this.expiredAt > Date.now());

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
