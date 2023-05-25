import express from "express";
import TicketType from "../models/ticketType.js";
import * as factory from "../controllers/factory.js";
import * as ticketTypeController from "../controllers/ticketTypeControllers.js";
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router();

router
  .route("/")
  .get(
    factory.getAll(TicketType)
    )
  .post(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.createAll
    )

//使用票種id:單筆處理資料
router
  .route("/single/:id")
  .get(
    factory.getOne(TicketType)
        )
  .patch(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    factory.updateOne(TicketType))
  .delete(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    factory.deleteOne(TicketType)
   );
  
//使用活動id:多筆處理資料
   router
   .route("/many/:id")
   .get(
     ticketTypeController.getAllActivityTickets
         )
   .patch(
     authControllers.authToken,
     ticketTypeController.checkOwner,
     ticketTypeController.updateAll)
   .delete(
     authControllers.authToken,
     ticketTypeController.checkOwner,
     ticketTypeController.deleteAll
    );
export default router;
