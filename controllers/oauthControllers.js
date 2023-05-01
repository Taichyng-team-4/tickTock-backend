import User from "../models/user.js";
import * as authHelper from "../utils/helper/auth.js";
import * as errorTable from "../utils/table/error.js";
import catchAsync from "../utils/error/catchAsync.js";

export const oauthGoogle = catchAsync(
  async (accessToken, refreshToken, profile, cb) => {
    let user;

    // 1) Check the incoming profile has email & display name data
    if (
      !authHelper.isObjHasEmail(profile) ||
      !authHelper.isObjHasDisplayName(profile)
    ) {
      return cb(errorTable.googleLoginFailError(), null);
    }

    // 2) Check if the user already exist
    user = await User.findOne({ googleId: profile.id });

    // 3) Get the user information by oauth
    if (user) return cb(null, user);

    // 4) User already exist but he does not have google login before
    user = await User.findOne({ email: profile.email });

    // 5) Record the google id about the user
    if (user) {
      user.googleId = profile.id;
      await user.save();

      return cb(null, user);
    }

    // 6) New user, create an account for him
    user = await User.create(
      {
        email: profile.emails[0].value,
        googleId: profile.id,
      },
      { validateModifiedOnly: true }
    );
    if (user) return cb(null, user);

    return cb(errorTable.googleLoginFailError(), null);
  }
);

export const googleSuccess = (req, res, next) => {
  // 1) Check user exist in session
  if (!req.session.passport) throw errorTable.googleLoginFailError();
  if (!req.session.passport.user) throw errorTable.googleLoginFailError();

  // 2) create token
  const token = authHelper.createJWT({ id: req.session.passport.user._id });

  // 3) Remove the user info in session, we don't need it
  req.logout((err) => {
    if (err) return next(err);

    // 4) Send the info to frontend
    res.redirect(process.env.CLIENT_URL + `/oauth/success/?token=${token}`);
  });
  
  throw errorTable.googleLoginFailError();
};
