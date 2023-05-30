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
    status: {
      type: String,
      required: [true, "A ticket list should has a status"],
    },
    seatNo: {
      type: String,
      required: [true, "A ticket list should has a seat number"],
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


ticketListSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});
ticketListSchema.index({ ticketTypeId: 1, seatNo: 1 }, { unique: true });

const TicketList = mongoose.model("TicketList", ticketListSchema);

export default TicketList;
