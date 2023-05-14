export const removeDocKeys = (obj, keys) =>
  obj.toObject({
    transform: (doc, ret) => {
      keys.forEach((key) => {
        delete ret[key];
      });
      return ret;
    },
  });

export const sanitizeCreatedDoc = (obj) =>
  removeDocKeys(obj, ["_id", "__v", "createdAt", "updatedAt"]);

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
    if (value && typeof value === "object") {
      const newValue = {};
      Object.keys(value).forEach((operator) => {
        if (validOperators.includes(operator)) {
          newValue[`$${operator}`] = value[operator];
        }
      });
      if (Object.keys(newValue).length) newObj[key] = newValue;
    }
  });
  return newObj;
};

export const toUTC = (date) => date.split("/").join("-");

export const removeId = (e) => {
  if (e.endsWith("Id")) return e.slice(0, -2);
  if (e.endsWith("ID")) return e.slice(0, -2);
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
