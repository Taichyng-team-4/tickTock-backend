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
  removeDocKeys(obj, ["_id", "__v", "deletedAt", "createdAt", "updatedAt"]);

export const removeDocObjId = (obj) => removeDocKeys(obj, ["_id"]);

export const removeDocsObjId = (array) =>
  array.map((obj) => removeDocObjId(obj));