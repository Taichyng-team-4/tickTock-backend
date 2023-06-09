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
      required: [true, "A ticket type should has a name"],
      minLength: [1, "An ticket type name should longer than 1 characters"],
      maxLength: [
        250,
        "An ticket type name should not longer than 250 characters",
      ],
    },
    zone: {
      type: String,
      required: [true, "A ticket type should has a zone"],
      validate: [
        validator.isAlphanumeric,
        "The zone of ticketType should only contain alphabet or number.",
      ],
    },
    price: {
      type: Number,
      required: [true, "A ticket should has a price when purchase"],
      validate: [
        (value) => validator.isNumeric(value.toString()),
        "Price should only contain number",
      ],
    },
    total: {
      type: Number,
      required: [
        true,
        "A ticket type should provide the total number of tickets",
      ],
      minLength: [1, "A ticke type should at least provide 1 ticket"],
      validate: [
        (value) => validator.isNumeric(value.toString()),
        "total should only contain number",
      ],
    },
    saleStartAt: {
      type: Date,
      required: [true, "A ticke type should has a sale start date"],
      validate: [
        function (val) {
          return val > Date.now();
        },
        "Sale start date should be in the future",
      ],
    },
    saleEndAt: {
      type: Date,
      required: [true, "A ticke type should has a sale end date"],
      validate: [
        function (val) {
          return val > Date.now();
        },
        "Sale end date should be in the future",
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

ticketTypeSchema.index({ activityId: 1, name: 1, deletedAt: 1 }, { unique: true });

ticketTypeSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

const TicketType = mongoose.model("TicketType", ticketTypeSchema);

export default TicketType;
