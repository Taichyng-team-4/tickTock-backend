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

export const getFindByIdQuery = ({
  Model,
  id,
  select = "-createdAt -updatedAt -__v",
  populate,
}) => Model.findById(id).select(select).populate(populate);

export const getFindQuery = ({
  Model,
  filter = {},
  select = "-createdAt -updatedAt -__v",
  populate,
}) => Model.find(filter).select(select).populate(populate);

export const getFindByIdQueryWithDeleted = (input) => {
  const query = getFindByIdQuery(input);
  query.$locals = { getDeleted: true };
  return query;
};

export const getFindQueryWithDeleted = (input) => {
  const query = getFindQuery(input);
  query.$locals = { getDeleted: true };
  return query;
};
