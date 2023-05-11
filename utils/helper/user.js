import * as errorTable from "../error/errorTable.js";

export const isProfileOwner = (queryUserId, userId) => queryUserId === userId;

export const checkUpdateFields = (query, notAllowFields) => {
  const wrongFields = [];
  notAllowFields.forEach((el) => {
    if (Object.keys(query).includes(el)) wrongFields.push(el);
  });

  if (!!wrongFields.length)
    throw errorTable.notAllowUpdateError(wrongFields);
};
