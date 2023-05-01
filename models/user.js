import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

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
      require: [true, "A user should has his passowrd"],
      minLength: [6, "password must at least 6 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, "A user should has his confromPassowrd"],
      minLength: [6, "confromPassowrd must at least 6 characters"],
      validate: [
        function (val) {
          return val === this.password;
        },
        "passwords are not same",
      ],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "A user should has a name"],
      minLength: [1, "A user name should longer than 1 characters"],
      maxLength: [250, "A user name should not longer than 250 characters"],
    },
    lastName: {
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
      default: "http://www.sample.com",
      validate: [validator.isURL, "The avatar should be an url"],
    },
    phone: {
      type: String,
      required: [true, "A user should provide a phone"],
      select: false,
    },
    birthday: {
      type: Date,
      validate: [
        function (val) {
          return val < Date.now();
        },
        "Pleas provide a valid birth",
      ],
      select: false,
    },
    googleId: { type: String, select: false, unique: true },
    emailVerifyToken: { type: String, select: false },
    emailValidatedAt: { type: Date, default: undefined },
    passwordUpdatedAt: { type: Date, default: undefined },
    deletedAt: { type: Date, default: undefined },
  },
  {
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("isEmailValidated").get(function () {
  if (!this.emailValidatedAt) return false;
  return true;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordUpdatedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  plainTextPassword,
  hashPassword
) {
  return bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.methods.isTokenBeforePasswordUpdate = function (jwtIat) {
  if (this.passwordUpdatedAt)
    return 1000 * jwtIat < this.passwordUpdatedAt.getTime();
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
