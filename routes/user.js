import express from "express";
import User from "../models/user.js";
import * as factory from "../controllers/factory.js";

const router = express.Router();

router.route("/").get(factory.getAll(User)).post(factory.createOne(User));
router
  .route("/:id")
  .get(factory.getOne(User))
  .patch(factory.updateOne(User))
  .delete(factory.deleteOne(User));

export default router;
