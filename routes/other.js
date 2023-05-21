import express from "express";

import * as otherController from "../controllers/otherControllers.js";

const router = express.Router();

router.get("/home", otherController.getHome);

export default router;
