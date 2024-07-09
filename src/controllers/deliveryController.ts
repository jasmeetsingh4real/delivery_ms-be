import { decryptForServer } from "../auth_helper/decryprtForServer";
import { updateDeliveryStatusSchema } from "../schemas/deliverySchemas";
import { DeliveryService } from "../services/DeliveryService";
import { EnumStaffRoles } from "../types/staffTypes";

export class DeliveryController {
  static getAllDeliveries = async (req, res) => {
    try {
      const dateRange = req.body;
      const restaurantId = "225801a0-45c1-4a05-810b-81b8af1c40dd";
      const deliveries = await DeliveryService.getAllDeliveries(restaurantId);
      return res.json({
        result: deliveries,
        success: true,
        errorMessage: null,
      });
    } catch (err: any) {
      return res.json({
        result: null,
        success: false,
        errorMessage: err.message || "something went wrong",
      });
    }
  };

  static createDelivery = async (req, res) => {
    try {
      if (!req.body.encryptedData) {
        throw new Error("EncryptedData not found in the request");
      }
      const data: any = decryptForServer(req.body.encryptedData);
      const orderId = data.orderId;
      const deliveryNotes = data.deliveryNotes;
      if (!orderId) {
        throw new Error("Order Id not found");
      }
      const savedDetails = await DeliveryService.createDelivery({
        orderId,
        deliveryNotes,
      });
      return res.json({
        result: savedDetails.id,
        success: true,
        errorMessage: null,
      });
    } catch (err: any) {
      return res.json({
        result: null,
        success: false,
        errorMessage: err.message || "something went wrong",
      });
    }
  };
  static updateDeliveryStatus = async (req, res) => {
    try {
      const validatedData = updateDeliveryStatusSchema.safeParse(req.body);
      if (!validatedData.success) {
        throw new Error(validatedData.error.message || "Invalid Data");
      }
      //veriy that user updating this status belongs to the same rertautant from which order was created
      await DeliveryService.updateDeliveryStatus(
        validatedData.data.deliveryId,
        validatedData.data.status
      );

      return res.json({
        result: "status updated",
        success: true,
        errorMessage: null,
      });
    } catch (err: any) {
      return res.json({
        result: null,
        success: false,
        errorMessage: err.message || "something went wrong",
      });
    }
  };
}
