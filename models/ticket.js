import mongoose from "mongoose";
import validator from "validator";

const ticketSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An ticket should has an ownerId"],
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
    zone: {
      type: Boolean,
      required: [true, "A ticket should has a zone"],
      validate: [
        validator.isAlphanumeric,
        "The zone of ticket should only contain alphabet or number.",
      ],
    },
    seatNo: {
      type: Boolean,
      required: [true, "A ticket should has a seat number"],
      validate: [
        validator.isAlphanumeric,
        "The seat number of ticket should only contain alphabet or number.",
      ],
    },
    price: {
      type: Boolean,
      required: [true, "A ticket should has a price when purchase"],
      validate: [validator.isNumeric, "Price should only contain number"],
    },
    QRcode: {
      type: Boolean,
      required: [true, "A ticket should has its QRcode of the pass"],
    },
    startAt: {
      type: Date,
      required: [true, "A ticket should mark the activity start date"],
    },
    expiredAt: {
      type: Date,
      required: [true, "A ticket should mark the expired date"],
    },
    refundedAt: {
      type: Date,
      default: null,
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

ticketSchema.virtual("isStart").get(function () {
  return this.startAt < Date.now();
});

ticketSchema.virtual("isExpired").get(function () {
  return this.expiredAt < Date.now();
});

ticketSchema.virtual("isRefunded").get(function () {
  if (!this.refundedAt) return false;
  return this.refundedAt < Date.now();
});

ticketSchema.virtual("isValid").get(function () {
  return !this.refundedAt && this.expiredAt > Date.now();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
