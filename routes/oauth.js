import express from "express";
import passport from "passport";
import * as oauthController from "../controllers/oauthControllers.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/oauths/google/fail",
  }),
  oauthController.googleSuccess
);

router.get("/google/fail", oauthController.googleFail);

export default router;
