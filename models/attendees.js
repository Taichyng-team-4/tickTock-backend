import mongoose from "mongoose";
import validator from "validator";

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
    name: {
      type: String,
      required: [true, "An attendee should has a name"],
      minLength: [1, "An attendee name should longer than 1 characters"],
      maxLength: [
        250,
        "An attendee name should not longer than 250 characters",
      ],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please fill a valid email address"],
      unique: true,
    },
    phone: String,
    age: {
      type: String,
      minLength: [0, "An age should greater than 0"],
      maxLength: [200, "An age should not greater than 200"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "anonymous"],
        message: "gender should be male, female or anonymous",
      },
      default: "anonymous",
    },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Attendee = mongoose.model("Attendee", attendeeSchema);

module.exports = Attendee;
