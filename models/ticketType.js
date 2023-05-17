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
    price: {
      type: Number,
      require: [true, "A ticket should has a price when purchase"],
      validate: [value => validator.isNumeric(value.toString()), "Price should only contain number"],
    },
    total: {
      type: Number,
      minLength: [1, "A ticke type should at least provide 1 ticket"],
      require: [
        true,
        "A ticket type should provide the total number of tickets",
      ],
    },
    startAt: {
      type: Date,
      required: [true, "An activity should has a start date"],
      validate: [
        function (val) {
          return val > Date.now();
        },
        "Start date should be in the future",
      ],
    },
    endAt: {
      type: Date,
      required: [true, "An activity should has an end date"],
      validate: [
        function (val) {
          return val > Date.now();
        },
        "End date should be in the future",
      ],
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

const TicketType = mongoose.model("TicketType", ticketTypeSchema);

export default TicketType;

