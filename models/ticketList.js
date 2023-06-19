import mongoose from "mongoose";

const ticketListSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: "Activity",
      required: [true, "An ticket list should has an activityId"],
    },
    ticketTypeId: {
      type: mongoose.Types.ObjectId,
      ref: "TicketType",
      required: [true, "An ticket list should has an ticketTypeId"],
    },
    ticketId: {
      type: mongoose.Types.ObjectId,
      ref: "Ticket",
    },
    seatNo: {
      type: String,
      required: [true, "A ticket list should has a seat number"],
    },
    isTrading: {
      type: Boolean,
      default: false,
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

ticketListSchema.index(
  { ticketTypeId: 1, seatNo: 1, deletedAt: 1 },
  { unique: true }
);

ticketListSchema.index(
  { ticketId: 1, deletedAt: 1 },
  {
    unique: true,
    partialFilterExpression: {
      ticketId: { $exists: true },
      deletedAt: { $exists: false },
    },
  }
);

ticketListSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

ticketListSchema.virtual("isTaken").get(function () {
  return !!(this.ticketId || this.isTrading);
});

const TicketList = mongoose.model("TicketList", ticketListSchema);

export default TicketList;
