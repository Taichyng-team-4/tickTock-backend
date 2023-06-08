import * as helper from "./helper.js";
import queryFeatures from "./queryFeatures.js";
import TicketType from "../../models/ticketType.js";
import * as errorTable from "../error/errorTable.js";

export const updateTicketTypes = async (
  { activityId, updateQuery = [], createQuery = [] },
  session
) => {
  const updateTicketTypeIds = updateQuery.map((el) => el.id);
  const createQueryWithActivityId = helper.addActivityIdToObjs(
    createQuery,
    activityId
  );

  // 1) Delete the ticketType that does not provided list but exist
  const filter = {
    activityId,
    deletedAt: null,
    _id: { $nin: updateTicketTypeIds },
  };
  const update = { $set: { deletedAt: Date.now() } };
  const options = { session: session };

  await TicketType.updateMany(filter, update, options);

  // 2) Update the ticketType which exist before
  const updatedTicketTypes = await Promise.all(
    updateQuery.map(async (data) => {
      const filter = { activityId, _id: data.id };
      const update = { $set: helper.removeObjKeys(data, ["id"]) };
      const options = { new: true, runValidators: true, session: session };

      const updatedDoc = TicketType.findOneAndUpdate(filter, update, options);

      const features = new queryFeatures(updatedDoc, {});
      const outputData = await features.query;
      if (!outputData) throw errorTable.idNotFoundError();
      return outputData;
    })
  );

  // 3) Create the ticketType which not exist
  const createdTicketTypes = await TicketType.create(
    createQueryWithActivityId,
    { session }
  );

  return [...updatedTicketTypes, ...createdTicketTypes];
};
