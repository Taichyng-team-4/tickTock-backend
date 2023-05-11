import express from "express";

import * as orgController from "../controllers/orgControllers.js";

const router = express.Router();

router.route("/").get(orgController.getAll).post(orgController.createOne);

router.get("/deleted", orgController.getAllWithDeleted);

router
  .get("/deleted/:id", orgController.getOneWithDeleted)

router
  .route("/:id")
  .get(orgController.getOne)
  .patch(orgController.updateOne)
  .delete(orgController.deleteOne);

export default router;
