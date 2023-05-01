import passport from "passport";
import passportGoogle from "passport-google-oauth20";

import * as oauthController from "../controllers/oauthControllers.js";

const GoogleStrategy = passportGoogle.Strategy;

// Serialize the user data of session to req.session.passport.user
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });
  });
});

// Deserialize req.session.passport.user to user obj
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "api/v1/oauths/google/redirect",
    },
    oauthController.oauthGoogle
  )
);
