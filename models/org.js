import mongoose from "mongoose";
import validator from "validator";

const orgSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "An organization should has an owner"],
    },
    name: {
      type: String,
      required: [true, "An organization should has a name"],
      minLength: [1, "An organization name should longer than 1 characters"],
      maxLength: [
        250,
        "An organization name should not longer than 250 characters",
      ],
    },
    img: {
      type: String,
      default: "https://unsplash.com/photos/aRTjFXs6HNc",
      validate: [validator.isURL, "The organization img should be an url"],
    },
    email: {
      type: String,
      required: [true, "An organization should has a contact email"],
      validate: [validator.isEmail, "Please fill a valid email address"],
    },
    phone: String,
    ext: String,
    summary: {
      type: String,
      trim: true,
      maxLength: [
        500,
        "An organization summary should not longer than 250 characters",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [
        2000,
        "An organization description should not longer than 500 characters",
      ],
    },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orgSchema.index({ name: 1, deletedAt: 1 }, { unique: true });

orgSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

const Org = mongoose.model("Org", orgSchema);

export default Org;
