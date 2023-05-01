import express from "express";
import passport from "passport";
import * as errorTable from "../utils/table/error.js"
import * as oauthController from "../controllers/oauthControllers.js";

const router = express.Router();

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/oauths/google/failed",
  }),
  oauthController.googleSuccess,
);

router.get("/google/failed", (req, res) => {
  throw errorTable.googleLoginFailError();
});

export default router;
