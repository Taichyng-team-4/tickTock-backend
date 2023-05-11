export const removeDocRedundantId = (obj) =>
  obj.toObject({
    transform: (doc, ret) => {
      delete ret._id;
      return ret;
    },
  });

export const removeDocsRedundantId = (array) =>
  array.map((obj) => removeDocRedundantId(obj));
