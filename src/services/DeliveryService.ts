import moment = require("moment");
import { dataSource } from "../db/datasource/app_data_source";
import { DeliveriesEntity } from "../entity/deliveries.entity";
import { EnumDeliveryStatus } from "../types/staffTypes";

export class DeliveryService {
  static getAllDeliveries = async (filter: {
    dateRange: { fromDate: Date; toDate: Date };
    status?: EnumDeliveryStatus;
  }) => {
    const deliveriesRepo = dataSource.getRepository(DeliveriesEntity);

    await deliveriesRepo.find({
      where: filter,
    });
  };

  static createDelivery = async (data: {
    orderId: string;
    deliveryNotes?: string;
  }) => {
    const deliveryRepo = dataSource.getRepository(DeliveriesEntity);
    await deliveryRepo.save({
      assignedToStaff: "not assigned",
      pickupTime: moment(),
      orderId: data.orderId,
      deliveryNotes: data.deliveryNotes || "",
      status: EnumDeliveryStatus.PENDING,
    });
  };
}
