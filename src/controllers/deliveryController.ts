import { DeliveryService } from "../services/DeliveryService";
import { EnumStaffRoles } from "../types/staffTypes";

export class DeliveryController {
  static getAllDeliveries = async (req, res) => {
    try {
      const dateRange = req.body;
      const deliveries = await DeliveryService.getAllDeliveries({
        dateRange,
      });
    } catch (err: any) {}
  };
}
