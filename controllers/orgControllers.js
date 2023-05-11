import * as factory from "./factory.js";
import Org from "../models/org.js";

export const getOne = factory.getOne(Org);
export const getAll = factory.getAll(Org);
export const createOne = factory.createOne(Org);
export const updateOne = factory.updateOne(Org);
export const deleteOne = factory.deleteOne(Org);

export const getOneWithDeleted = factory.getOneWithDeleted(Org);
export const getAllWithDeleted = factory.getAllWithDeleted(Org);