import express from "express";

import * as otherController from "../controllers/otherControllers.js";

const router = express.Router();

router.get("/home", otherController.getHome);
router.get("/partners", otherController.getPartner);
router.get("/faqs", otherController.getFaqs);

export default router;
