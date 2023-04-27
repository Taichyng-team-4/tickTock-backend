import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An activity attendee should has an userId"],
    },
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: "Activity",
      required: [true, "An activity attendee should has an activityId"],
    },
    name: String,
    email: String,
    phone: String,
    age: String,
    gender: String,
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Attendee = mongoose.model("Attendee", attendeeSchema);

module.exports = Attendee;
