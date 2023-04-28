import mongoose from "mongoose";
import validator from "validator";

const ticketTypeSchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: "Activity",
      required: [true, "An ticket type should has an activityId"],
    },
    name: {
      type: String,
      require: [true, "A ticket type should has a name"],
      minLength: [1, "An ticket type name should longer than 1 characters"],
      maxLength: [
        250,
        "An ticket type name should not longer than 250 characters",
      ],
    },
    zone: {
      type: String,
      require: [true, "A ticket type should has a zone"],
      validate: [
        validator.isAlphanumeric,
        "The zone of ticketType should only contain alphabet or number.",
      ],
    },
    currency: {
      type: String,
      require: [true, "A ticket should has a currency when purchase"],
      validate: [validator.isAlpha, "Currency should only contain alphabet"],
    },
    price: {
      type: Boolean,
      require: [true, "A ticket should has a price when purchase"],
      validate: [validator.isNumeric, "Price should only contain number"],
    },
    total: {
      type: Number,
      minLength: [1, "A ticke type should at least provide 1 ticket"],
      require: [
        true,
        "A ticket type should provide the total number of tickets",
      ],
    },
    remain: {
      type: Number,
      minLength: [0, "The reamin ticke should greater than 0"],
      validate: [
        function (val) {
          return val <= this.total;
        },
        "The remain ticket should not greater than the total ticket number",
      ],
      default: () => this.total,
    },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TicketType = mongoose.model("TicketType", ticketTypeSchema);

module.exports = TicketType;
