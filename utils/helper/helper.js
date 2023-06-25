import * as errorTable from "../error/errorTable.js";

const fieldModelMapping = {
  userId: "User",
  ownerId: "User",
  orgId: "Org",
  venueId: "Venue",
  activityId: "Activity",
  settingId: "ActivitySetting",
  ticketId: "Ticket",
  ticketListId: "TicketList",
  ticketTypeIds: "TicketType",
};

export const removeDocKeys = (obj, keys) =>
  obj.toObject({
    transform: (doc, ret) => {
      keys.forEach((key) => {
        delete ret[key];
      });
      return ret;
    },
  });

export const sanitizeCreatedDoc = (obj) => {
  if (!obj) return {};
  if (Array.isArray(obj))
    return obj.map((el) =>
      removeDocKeys(el, ["_id", "__v", "createdAt", "updatedAt"])
    );
  return removeDocKeys(obj, ["_id", "__v", "createdAt", "updatedAt"]);
};

export const removeDocObjId = (obj) => removeDocKeys(obj, ["_id"]);

export const removeDocsObjId = (array) =>
  array.map((obj) => removeDocObjId(obj));

export const removeObjKeys = (obj, keysToRemove) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => !keysToRemove.includes(key))
  );

export const replaceMongooseOpt = (obj, validOperators) => {
  const newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (!value) return;
    if (typeof value === "object") {
      const newValue = {};
      Object.keys(value).forEach((operator) => {
        if (validOperators.includes(operator)) {
          newValue[`$${operator}`] = value[operator];
        }
      });
      if (Object.keys(newValue).length) newObj[key] = newValue;
    } else if (typeof value === "string") newObj[key] = value;
  });
  return newObj;
};

export const toUTC = (date) => date.split("/").join("-");
export const toLocalTime = (date) => date.split("-").join("/");

export const removeId = (e) => {
  if (e.endsWith("Id")) return e.slice(0, -2);
  if (e.endsWith("ID")) return e.slice(0, -2);
  if (e.endsWith("Ids")) return e.slice(0, -3) + "s";
  if (e.endsWith("IDs")) return e.slice(0, -3) + "s";
  return e;
};

export const removeFieldsId = (obj, fields) =>
  Object.keys(obj).reduce((acc, key) => {
    if (fields.includes(key)) {
      acc[removeId(key)] = obj[key];
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

export const generateSeatNumber = (zone, seatOrder) => {
  // const ticketNumber = uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();
  return ("" + zone).toUpperCase() + seatOrder;
};

export const addActivityIdToObjs = (objs, activityId) =>
  objs.map((el) => ({ ...el, activityId }));

export const checkSameIds = (array) => {
  const firstId = array[0].id;
  return array.every((el) => {
    if (el.id !== firstId) return false;
    return true;
  });
};

export const addURLQueryPop = (origin, targets) => {
  if (!Array.isArray(targets)) throw errorTable.inputFormatError();
  if (origin)
    return Array.from(new Set([...origin.split(","), ...targets])).join(" ");
  else {
    return targets.split(",").join(" ");
  }
};

export const executeInQueue = async ({
  dataAry, //the array that you .map through
  callback, //the function that you fire inside .map
  index = 0,
  log = "",
  results = [],
}) => {
  log += `execute ${index}`;
  if (index === dataAry.length) return results;

  let d = dataAry[index];
  try {
    let result = await callback(d, index);

    results.push(result);
    log += `end ${index}`;
    if (index >= dataAry.length) {
      log += `finish all execute`;
      return;
    }
    return executeInQueue({
      dataAry,
      callback,
      log,
      index: index + 1,
      results,
    });
  } catch (err) {
    console.log(err);
    log += `error at execute ${index}`;
    throw errorTable.queueError(index);
  }
};

export const getModelNameByField = (field) => fieldModelMapping[field] || null;

export const generatePopulateObject = (input) => {
  const fields = input.split(".");
  let populateObj = null;

  for (let i = fields.length - 1; i >= 0; i--) {
    const field = fields[i];
    const modelName = getModelNameByField(field);
    if (!modelName) return;
    populateObj = {
      path: field,
      populate: populateObj,
      model: modelName,
      select: "-createdAt -updatedAt",
    };
  }

  return populateObj;
};

export const generatePopulateObjects = (input) => {
  const fields = input.split(","); // Split the input string by comma to get multiple paths
  let populateObjs = [];

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i].trim();

    populateObjs.push(generatePopulateObject(field));
  }

  return populateObjs;
};
