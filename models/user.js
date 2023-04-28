import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "A user should provide an email"],
      validate: [validator.isEmail, "Please fill a valid email address"],
      select: false,
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, "password must at least 6 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "A user should has a name"],
      minLength: [1, "A user name should longer than 1 characters"],
      maxLength: [250, "A user name should not longer than 250 characters"],
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
      validate: [validator.isURL, "The avatar should be an url"],
    },
    phone: {
      type: String,
      required: [true, "A user should provide a phone"],
      select: false,
    },
    birthday: {
      type: Date,
      validate: [(val) => val < Date.now(), "Pleas provide a valid birth"],
      select: false,
    },
    emailValidateAt: { type: Date, default: null },
    deletedAt: { type: Date, select: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ticketSchema.virtual("isEmailValidateAt").get(() => {
  if (!this.emailValidateAt) return false;
  return true;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
