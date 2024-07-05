import { decryptForServer } from "../auth_helper/decryprtForServer";
import { DeliveryService } from "../services/DeliveryService";
import { EnumStaffRoles } from "../types/staffTypes";

export class DeliveryController {
  static getAllDeliveries = async (req, res) => {
    try {
      const dateRange = req.body;
      const deliveries = await DeliveryService.getAllDeliveries({
        dateRange,
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
      await DeliveryService.createDelivery({
        orderId,
        deliveryNotes,
      });
      return res.json({
        result: null,
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
