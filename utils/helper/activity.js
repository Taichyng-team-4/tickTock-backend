import mongoose from "mongoose";

import TicketList from "../models/ticketList.js";

export const getRemain = async (activity) => {
  activity.total = 0;
  activity.remain = 0;
  return Promise.all(
    activity?.ticketTypes?.map(async (ticketType) => {
      activity.total += ticketType.total;
      const result = await TicketList.aggregate([
        {
          $match: {
            ticketTypeId: new mongoose.Types.ObjectId(ticketType.id),
            deletedAt: null,
          },
        },
        {
          $group: {
            _id: null,
            remain: {
              $sum: {
                $cond: [
                  {
                    $or: [{ $eq: ["$ticketId", null] }, { $not: "$ticketId" }],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);
      if (result && result.length === 1) {
        ticketType.remain = result[0].remain;
        activity.remain += result[0].remain;
      } else ticketType.remain = 0;
    })
  );
};
