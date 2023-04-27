import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "A user should provide an email"],
      select: false,
    },
    isEmailValidate: { type: Boolean, default: false },
    password: {
      type: String,
      minLength: [6, "password must at least 6 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "A user should has a name"],
      maxLength: 250,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "anonymous"],
        message: "gender should be male, female or anonymous",
      },
      default: "male",
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: [true, "A user should provide a phone"],
      select: false,
    },
    birthday: { type: Date, select: false },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
