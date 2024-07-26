import { decryptForServer } from "../auth_helper/decryprtForServer";
import { dataSource } from "../db/datasource/app_data_source";
import { RestaurantEntity } from "../entity/restaurant.entity";
import { updateDeliveryStatusSchema } from "../schemas/deliverySchemas";
import { DeliveryService } from "../services/DeliveryService";
import { EnumStaffRoles } from "../types/staffTypes";

export class DeliveryController {
  static getAllDeliveries = async (req, res) => {
    try {
      const { dateFilter, deliveryStatusFilter, staffId } = req.body;

      if (!staffId || !dateFilter) {
        throw new Error("Incomplete Data");
      }
      const staffDetails = await DeliveryService.getStaffDetailsById(staffId);

      const deliveries = await DeliveryService.getAllDeliveries(
        staffDetails.restaurantId,
        dateFilter,
        deliveryStatusFilter
      );

      return res.json({
        result: { deliveries },
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
  static getDeliveriesCount = async (req, res) => {
    try {
      const { restaurantId, dateFilter } = req.body;
      if (!restaurantId || !dateFilter) {
        throw new Error("Incomplete data");
      }

      const deliveriesCount = await DeliveryService.getDeliveriesCount(
        restaurantId,
        dateFilter
      );

      return res.json({
        result: deliveriesCount,
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

  static getRestaurantInfo = async (req, res) => {
    try {
      const { staffId } = req.body;
      if (!staffId) {
        throw new Error("StaffId required");
      }
      const staffDetails = await DeliveryService.getStaffDetailsById(staffId);
      const restaurantRepo = dataSource.getRepository(RestaurantEntity);

      const restaurantDetails = await restaurantRepo.findOne({
        where: {
          id: staffDetails.restaurantId,
        },
      });

      return res.json({
        result: restaurantDetails,
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
