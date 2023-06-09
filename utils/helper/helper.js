import { v4 as uuidv4 } from "uuid";

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

export const generateSeatNumber = () => {
  const ticketNumber = uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();
  return ticketNumber;
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
