import express from "express";

import * as userControllers from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", userControllers.signup);
router.get("/verify_email", userControllers.verify_email);
router.post("/login", userControllers.login);
router.patch("/profile", userControllers.profile);
router.post("/password/forgot", userControllers.forgotPassword);
router.patch("/password/update", userControllers.updatePassword);

export default router;
