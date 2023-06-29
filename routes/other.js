import express from "express";
import * as upload from "../utils/helper/upload.js";
import * as otherController from "../controllers/otherControllers.js";

const router = express.Router();

router.get("/home", otherController.getHome);

router.post(
  "/img",
  upload.uploadToMemory.single("image"),
  otherController.updateImg
);

export default router;

