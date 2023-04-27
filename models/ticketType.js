import mongoose from "mongoose";

const ticketTypeSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: "Activity",
      required: [true, "An ticket type should has an activityId"],
    },
    name: { type: String, require: [true, "A ticket type should has a name"] },
    zone: { type: String, require: [true, "A ticket type should has a zone"] },
    price: {
      type: Number,
      require: [true, "A ticket type should has a price"],
    },
    remain: Number,
    total: {
      type: Number,
      require: [
        true,
        "A ticket type should provide the total number of tickets",
      ],
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const TicketType = mongoose.model("TicketType", ticketTypeSchema);

module.exports = TicketType;
