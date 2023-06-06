import mongoose from "mongoose";
import * as helper from "./helper.js";
import * as ticketListHelper from "./ticketList.js";
import TicketList from "../../models/ticketList.js";
import * as errorTable from "../error/errorTable.js";

export const updateTicketLists = async (
  { activityId, ticketTypes },
  session
) => {
  const ticketTypesId = ticketTypes.map((el) => el.id);

  // 1) Get the current information of the activity
  const oldTicketListsGroup = await TicketList.aggregate([
    {
      $match: {
        activityId: new mongoose.Types.ObjectId(activityId),
        deletedAt: null,
      },
    },
    {
      $group: {
        _id: "$ticketTypeId",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        id: { $toString: "$_id" },
        count: 1,
      },
    },
  ]);
  const oldTicketTypesId = oldTicketListsGroup.map((el) => el.id);
  const newTicketTypes = [];
  const updateTicketTypes = [];
  ticketTypes.forEach((el) => {
    if (oldTicketTypesId.includes(el.id)) updateTicketTypes.push(el);
    else newTicketTypes.push(el);
  });

  // 2) Delete the ticket List that does not  exist
  const filter = {
    activityId,
    deletedAt: null,
    ticketId: null,
    ticketTypeId: { $nin: ticketTypesId },
  };

  const update = { $set: { deletedAt: Date.now() } };
  const options = { session };

  await TicketList.updateMany(filter, update, options);

  // 3) Filter which ticketList is bigger and which is smaller
  const totalDictionary = updateTicketTypes.reduce((obj, item) => {
    const { id, total } = item;
    obj[id] = total;
    return obj;
  }, {});

  const oldTotalDictionary = oldTicketListsGroup.reduce((obj, item) => {
    const { id, count } = item;
    obj[id] = count;
    return obj;
  }, {});

  // 4) Update the ticketList whose total number become bigger
  const biggerTicketTypes = ticketTypes
    .filter((el) => totalDictionary[el.id] > oldTotalDictionary[el.id])
    .map((el) => {
      el.add = totalDictionary[el.id] - oldTotalDictionary[el.id];
      return el;
    });

  const biggerTicketListData =
    ticketListHelper.generateTicketListFromTicketTypes(
      activityId,
      biggerTicketTypes,
      "add"
    );

  await TicketList.create(biggerTicketListData, {
    session,
  });

  // 5) Update the ticketList whose total number become smaller
  const smallerTicketTypes = ticketTypes
    .filter((el) => totalDictionary[el.id] < oldTotalDictionary[el.id])
    .map((el) => {
      el.minus = oldTotalDictionary[el.id] - totalDictionary[el.id];
      return el;
    });

  await Promise.all(
    smallerTicketTypes.map(async (ticketType) => {
      const ticketLists = await TicketList.find({
        activityId,
        ticketTypeId: ticketType.id,
        deletedAt: null,
        ticketId: null,
      }).limit(ticketType.minus);
      const ids = ticketLists.map((el) => el.id);
      await TicketList.updateMany(
        {
          activityId,
          ticketTypeId: ticketType.id,
          deletedAt: null,
          ticketId: null,
          _id: { $in: ids },
        },
        { $set: { deletedAt: Date.now() } },
        { session }
      );
    })
  );

  // 6) Create the ticketType which doest not exist
  const ticketListData = ticketListHelper.generateTicketListFromTicketTypes(
    activityId,
    newTicketTypes
  );
  await TicketList.create(ticketListData, {
    session,
  });
};

export const generateSingleTicket = (activityId, ticketTypeId) => ({
  activityId,
  ticketTypeId,
  seatNo: helper.generateSeatNumber(),
});

export const generateTicketListFromTicketTypes = (
  activityId,
  ticketTypes,
  amoutKey = "total"
) => {
  const ticketListData = [];
  for (const ticketType of ticketTypes) {
    if (!(ticketType[amoutKey] && typeof ticketType[amoutKey] === "number"))
      throw errorTable.wrongFormatError();

    for (let i = 0; i < ticketType[amoutKey]; i++) {
      const newTicket = generateSingleTicket(activityId, ticketType.id);
      ticketListData.push(newTicket);
    }
  }
  return ticketListData;
};
