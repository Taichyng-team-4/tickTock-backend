import catchAsync from "../utils/error/catchAsync.js";
import TicketType from "../models/ticketType.js";
import TicketList from "../models/ticketList.js";
import * as errorTable from "../utils/error/errorTable.js";
import Activity from "../models/activity.js";

import { v4 as uuidv4 } from "uuid";



export const createTicketList = catchAsync(async (req, res, next) => {
  // 前端判斷: if 前端該區域票數量+資料庫區域票數量 > 指定上限數量(暫定30)時: 顯示提示上限數量-資料庫票數量=該區域剩餘數量

  // const ticketTypeID = req.body.ticketTypeID
  const ticketTypeID = req.body.ticketTypeIds;
  
  const ticketTypes = await TicketType.find({ _id: { $in: ticketTypeID } });

  for (const ticketType of ticketTypes) {
    const ticketList = await TicketList.find({ ticketTypeId: ticketType._id });

    if (ticketList.length > 0) {
      throw errorTable.targetExists("ticketTypeID");
    }

    const activity = await Activity.findById(ticketType.activityId);
    if (!activity) throw errorTable.targetNotFindError("activity");

    const ticketListData = [];
    for (let i = 0; i < ticketType.total; i++) {
      const newTicket = {
        activityId: activity.id,
        ticketTypeId: ticketType.id,
        status: '未分配',
        modified_time: new Date(),
        seatNo: generateTicketNumber(), 
      };
      ticketListData.push(newTicket);
    }

    // 建立 ticketList 資料
    const createdTickets = await TicketList.create(ticketListData);

  }
  
  res.status(200).json({
    status: "success",
    message: "Ticket list created successfully.",
  });
});


const generateTicketNumber = () => {
  const ticketNumber = uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();
  return ticketNumber;
};