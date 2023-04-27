import mongoose from "mongoose";

const orgSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An organization should has an ownerId"],
    },
    name: {
      type: String,
      maxLength: 250,
      required: [true, "An organization should has a name"],
      unique: true,
    },
    img: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "An organization should has an email"],
    },
    phone: {
      type: String,
      required: [true, "An organization should has a phone"],
    },
    ext: { type: String },
    description: {
      type: String,
    },
    summary: {
      type: String,
    },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Org = mongoose.model("Org", orgSchema);

module.exports = Org;
