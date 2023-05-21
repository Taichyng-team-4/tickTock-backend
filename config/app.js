import hpp from "hpp";
import path from "path";
import cors from "cors";
import xss from "xss-clean";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import { fileURLToPath } from "url";
import compression from "compression";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import AppError from "../utils/error/appError.js";
import userRouters from "../routes/user.js";
import profileRouters from "../routes/profile.js";
import authRouters from "../routes/auth.js";
import oauthRouters from "../routes/oauth.js";
import orgRouters from "../routes/orgs.js";
import newsRouters from "../routes/news.js";
import orderRouters from "../routes/order.js";
import ticketRouters from "../routes/ticket.js";
import otherRouters from "../routes/other.js";
import activityRouters from "../routes/activity.js";
import venueRouters from "../routes/venue.js";
import settingRouters from "../routes/activitySetting.js";
<<<<<<< HEAD
import ticketTypeRouters from "../routes/ticketType.js"
=======
import partnerRouters from "../routes/partner.js";
import faqRouters  from "../routes/faq.js";
>>>>>>> dev

import { errorHandler } from "../utils/error/errorHandler.js";
import "./passportInit.js";

import express from "express";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// CORS
app.use(cors());

// Allow preflight
app.options("*", cors());

// Limit requests from same IP in 15 min
const limiter = rateLimit({
  max: 500,
  windowMs: 15 * 60 * 1000,
  message: "Too many request, please try again later!",
});
app.use("/routeYouWantToLimit", limiter);

// Body parser
app.use(express.json({ limit: "10kb" })); //to JSON
app.use(express.urlencoded({ extended: true, limit: "10kb" })); //recognize strings or arrays

// Cookie parser
app.use(cookieParser());

// Secure header
app.use(helmet());

// Development logging
if (process.env.APP_ENV === "dev") {
  app.use(morgan("dev"));
}

// Preventing the query injection (Data sanitization)
app.use(mongoSanitize());

// Preventing XSS (Data sanitization)
app.use(xss());

// Prevent parameter pollution
app.use(hpp({ whitelist: ["YourParams"] }));

//Session
app.use(
  session({
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
  })
);

// initalize passport
app.use(passport.initialize());

// deserialize cookie from the browser
app.use(passport.session());

// Compress send data
app.use(compression());

// Serving static file
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1/orgs", orgRouters);
app.use("/api/v1/news", newsRouters);
app.use("/api/v1/users", userRouters);
app.use("/api/v1/profile", profileRouters);
app.use("/api/v1/auths", authRouters);
app.use("/api/v1/oauths", oauthRouters);
app.use("/api/v1/orders", orderRouters);
app.use("/api/v1/tickets", ticketRouters);
app.use("/api/v1/activities", activityRouters);
app.use("/api/v1/venues", venueRouters);
app.use("/api/v1/settings", settingRouters);
app.use("/api/v1/ticketTypes",ticketTypeRouters);
app.use("/api/v1/partners", partnerRouters);
app.use("/api/v1/faqs", faqRouters);
app.use("/api/v1", otherRouters);

// Routes not found
app.all("*", (req, res, next) =>
  next(new AppError(`${req.originalUrl} not find`, 404))
);

// Deal with Error
app.use(errorHandler);

export default app;
