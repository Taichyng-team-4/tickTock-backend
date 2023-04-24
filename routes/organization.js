import express from "express";

import * as orgControllers from "../controllers/orgControllers.js";

const router = express.Router();

router.route("/").get(orgControllers.getAll).post(orgControllers.createOne);
router
  .route("/:orgId")
  .get(orgControllers.getOne)
  .put(orgControllers.updateOne)
  .delete(orgControllers.deleteOne);

export default router;
