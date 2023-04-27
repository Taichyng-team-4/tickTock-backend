import mongoose from "mongoose";

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
    isRefunded: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
    ticketTypeName: {
      type: String,
      require: [true, "A ticket should has its type name"],
    },
    zone: { type: Boolean, require: [true, "A ticket should has a zone"] },
    seatNo: {
      type: Boolean,
      require: [true, "A ticket should has a seat number"],
    },
    price: {
      type: Boolean,
      require: [true, "A ticket should has a price when purchase"],
    },
    QRcode: {
      type: Boolean,
      require: [true, "A ticket should has its QRcode of the pass"],
    },
    startAt: {
      type: Date,
      require: [true, "A ticket should mark the activity start date"],
      select: false,
    },
    expiredAt: {
      type: Date,
      require: [true, "A ticket should mark the expired date"],
      select: false,
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
