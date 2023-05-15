import mongoose from "mongoose";

const activitySettingSchema = new mongoose.Schema(
  {
    isAllowModify: {
      type: Boolean,
      required: [
        true,
        "An activity should provide whether to allow users to modify their provided information",
      ],
      default: true,
    },
    email: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: Boolean,
      default: false,
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

activitySettingSchema.pre(/^find/, function () {
  if (!(this.$locals && this.$locals.getDeleted))
    this.where({ deletedAt: null });
});

const ActivitySetting = mongoose.model(
  "ActivitySetting",
  activitySettingSchema
);

export default ActivitySetting;
