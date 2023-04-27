import * as dotenv from "dotenv";
dotenv.config();
//Init database
const DB = process.env.DB.replace("<user>", process.env.DB_USER).replace(
  "<password>",
  process.env.DB_PASSWORD
);

import mongoose from "mongoose";
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log("DB connection successful!"))
  .catch(() => console.log("DB connection fail!"));
