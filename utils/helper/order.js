import crypto from "crypto";
import { v4 as uudiv4 } from "uuid";
import * as errorTable from "../error/errorTable.js";

export const createLinePayHeader = (url, body) => {
  const nonce = uudiv4();
  const message = `${
    process.env.LINEPAY_CHANNEL_SECRET_KEY
  }${url}${JSON.stringify(body)}${nonce}`;

  const signature = crypto
    .createHmac("sha256", process.env.LINEPAY_CHANNEL_SECRET_KEY)
    .update(message)
    .digest("base64");

  return {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": process.env.LINEPAY_CHANNEL_ID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature,
  };
};

const isProductCorrect = (ticketType, createList) =>
  !!(
    ticketType &&
    ticketType.id &&
    ticketType.price &&
    createList[ticketType.id] &&
    createList[ticketType.id].quantity &&
    typeof createList[ticketType.id].quantity === "number"
  );

export const isOrderCorrect = (order) => {
  if (!order && order.detail && Array.isArray(order.detail)) return false;
  if (
    order.detail.length &&
    !(order.detail[0].ticketIds && Array.isArray(order.detail[0].ticketIds))
  )
    return false;
  return true;
};

export const createPackageAmout = (ticketTypes, createList) => {
  let amount = 0;
  ticketTypes.forEach((el) => {
    const product = {
      price: el.price,
      quantity: createList[el.id].quantity,
    };
    amount += product.quantity * product.price;
  });
  return amount;
};

export const createPackageProducts = (ticketTypes, createList) =>
  ticketTypes.map((el) => {
    if (!isProductCorrect(el, createList)) throw errorTable.tradingFailError();
    const product = {
      name: el.name,
      price: el.price,
      quantity: createList[el.id].quantity,
    };
    return product;
  });

export const createPackage = (ticketTypes, createList) => ({
  id: uudiv4(),
  amount: createPackageAmout(ticketTypes, createList),
  products: createPackageProducts(ticketTypes, createList),
});

export const creatLinePayBody = async ({ order, ticketTypes, createList }) => {
  const orderPackage = createPackage(ticketTypes, createList);

  return {
    amount: orderPackage.amount,
    orderId: order.id,
    currency: order.currency,
    packages: [orderPackage],
    redirectUrls: {
      confirmUrl: process.env.SERVER_URL + process.env.LINEPAY_CONFIRM_URL,
      cancelUrl: process.env.SERVER_URL + process.env.LINEPAY_CANCEL_URL,
    },
  };
};
