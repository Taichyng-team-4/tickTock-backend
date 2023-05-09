import mongoose from "mongoose";
import validator from "validator";

const orgSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An organization should has an ownerId"],
    },
    name: {
      type: String,
      required: [true, "An organization should has a name"],
      minLength: [1, "An organization name should longer than 1 characters"],
      maxLength: [
        250,
        "An organization name should not longer than 250 characters",
      ],
      unique: true,
    },
    img: {
      type: String,
      default: "",
      validate: [validator.isURL, "The organization avatar should be an url"],
    },
    email: {
      type: String,
      required: [true, "An organization should has an email"],
      validate: [validator.isEmail, "Please fill a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "An organization should has a phone"],
    },
    ext: { type: String },
    description: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
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

const Org = mongoose.model("Org", orgSchema);

module.exports = Org;
