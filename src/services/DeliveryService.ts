import { dataSource } from "../db/datasource/app_data_source";
import { DeliveriedEntity } from "../entity/deliveries.entity";
import { EnumDeliveryStatus } from "../types/staffTypes";

export class DeliveryService {
  static getAllDeliveries = async (filter: {
    dateRange: { fromDate: Date; toDate: Date };
    status?: EnumDeliveryStatus;
  }) => {
    const deliveriesRepo = dataSource.getRepository(DeliveriedEntity);

    await deliveriesRepo.find({
      where: filter,
    });
  };
}
