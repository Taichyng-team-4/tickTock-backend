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
      required: [true, "An ticket list should has an ticketId"],
    },
    seatNo: {
      type: String,
      require: [true, "A ticket list should has a seat number"],
      unique: false,
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ticketListSchema.index({ ticketTypeId: 1, seatNo: 1 }, { unique: true });

const TicketList = mongoose.model("TicketList", ticketListSchema);

module.exports = TicketList;
