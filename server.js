process.on("uncaughtException", (err) => {
  console.log("Uncaught exception happen!");
  console.log(err);
  process.exit(1);
});

import * as dotenv from "dotenv";
dotenv.config();    
import "./config/dbInit.js";
import app from "./config/app.js";

//Server listen port
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server starts listening at port ${port}`)
);

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection happen!");
  console.log(err);
  process.exit(1);
});
