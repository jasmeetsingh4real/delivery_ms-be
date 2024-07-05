import { DeliveryController } from "../controllers/deliveryController";

const express = require("express");
export const deliveryRouter = express.Router();

deliveryRouter.post("/getAlldeliveries", DeliveryController.getAllDeliveries);

deliveryRouter.post("/createDelivery", DeliveryController.createDelivery);

// deliveryRouter.post("/updateDeliveryStatus", DeliveryController.updateDeliveryStatus);
