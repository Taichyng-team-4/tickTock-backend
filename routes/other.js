import express from "express";

import * as otherControllers from "../controllers/otherControllers.js";

const router = express.Router();

router.get("/home", otherControllers.getHome);
router.get("/partners", otherControllers.getPartner);
router.get("/faqs", otherControllers.getFaqs);

export default router;
