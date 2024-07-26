import moment = require("moment");
import { dataSource } from "../db/datasource/app_data_source";
import { DeliveriesEntity } from "../entity/deliveries.entity";
import { EnumDeliveryStatus } from "../types/staffTypes";
import { OrdersEntity } from "../entity/orders.entity";
import { EnumOrderStatus } from "../types/RestaurentsTypes";
import { Between, EntityManager } from "typeorm";
import { RestaurantStaffEntity } from "../entity/restaurantStaff.entity";

export class DeliveryService {
  static getAllDeliveries = async (
    restaurantId: string,
    dateFilter: {
      fromDate: Date;
      toDate: Date;
    },
    deliveryStatusFilter: EnumDeliveryStatus
  ) => {
    const deliveriesRepo = dataSource.getRepository(DeliveriesEntity);
    const filter = {
      createdAt: Between(dateFilter.fromDate, dateFilter.toDate),
    };
    if (deliveryStatusFilter) {
      filter["status"] = deliveryStatusFilter;
    }
    return deliveriesRepo.find({
      where: {
        order: {
          restaurantId,
        },
        ...filter,
      },
      relations: {
        order: {
          order_items: true,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
  };

  static createDelivery = async (data: {
    orderId: string;
    deliveryNotes?: string;
  }) => {
    const deliveryRepo = dataSource.getRepository(DeliveriesEntity);
    return deliveryRepo.save({
      assignedToStaff: "not assigned",
      orderId: data.orderId,
      status: EnumDeliveryStatus.PENDING,
      deliveryNotes: data.deliveryNotes || "",
    });
  };

  static updateDeliveryStatus = async (
    deliveryId: number,
    status: EnumDeliveryStatus
  ) => {
    await dataSource.transaction(async (txn: EntityManager) => {
      const deliveryRepo = txn.getRepository(DeliveriesEntity);
      const orderRepo = txn.getRepository(OrdersEntity);
      const deliveryDetails = await deliveryRepo.findOne({
        where: {
          id: deliveryId,
        },
      });
      if (!deliveryDetails) {
        throw new Error("delivery details not found");
      }

      if (status === EnumDeliveryStatus.IN_TRANSIT) {
        await deliveryRepo.update(
          {
            id: deliveryId,
          },
          {
            status,
            pickupTime: moment().toDate(),
          }
        );
      } else if (status === EnumDeliveryStatus.DELIVERED) {
        await deliveryRepo.update(
          {
            id: deliveryId,
          },
          {
            status,
            deliveryTime: moment().toDate(),
          }
        );
      } else {
        await deliveryRepo.update(
          {
            id: deliveryId,
          },
          {
            status,
          }
        );
      }
      if (status === EnumDeliveryStatus.DELIVERED) {
        await orderRepo.update(
          {
            id: deliveryDetails.orderId,
          },
          {
            status: EnumOrderStatus.SUCCESSFUL,
          }
        );
      } else if (status === EnumDeliveryStatus.FAILED) {
        await orderRepo.update(
          {
            id: deliveryDetails.orderId,
          },
          {
            status: EnumOrderStatus.FAILED,
          }
        );
      } else {
        await orderRepo.update(
          {
            id: deliveryDetails.orderId,
          },
          {
            status: EnumOrderStatus.PENDING,
          }
        );
      }
    });
  };

  static getStaffDetailsById = async (staffId: number) => {
    const stafFRepo = dataSource.getRepository(RestaurantStaffEntity);
    const staffDetails = await stafFRepo.findOne({
      where: {
        id: staffId,
      },
    });
    if (!staffDetails) {
      throw new Error("Staff not found");
    }
    return staffDetails;
  };

  static getDeliveriesCount = async (
    restaurantId: string,
    dateFilter: {
      fromDate: Date;
      toDate: Date;
    }
  ) => {
    const deliveriesRepo = dataSource.getRepository(DeliveriesEntity);

    const deliveriesCount = {
      pending: 0,
      in_transit: 0,
      being_prepared: 0,
      delivered: 0,
      failed: 0,
    };

    deliveriesCount.pending = await deliveriesRepo.count({
      where: {
        order: {
          restaurantId,
        },
        createdAt: Between(dateFilter.fromDate, dateFilter.toDate),
        status: EnumDeliveryStatus.PENDING,
      },
      relations: {
        order: true,
      },
    });
    deliveriesCount.being_prepared = await deliveriesRepo.count({
      where: {
        order: {
          restaurantId,
        },
        createdAt: Between(dateFilter.fromDate, dateFilter.toDate),
        status: EnumDeliveryStatus.BEING_PREPARED,
      },
      relations: {
        order: true,
      },
    });
    deliveriesCount.failed = await deliveriesRepo.count({
      where: {
        order: {
          restaurantId,
        },
        createdAt: Between(dateFilter.fromDate, dateFilter.toDate),
        status: EnumDeliveryStatus.FAILED,
      },
      relations: {
        order: true,
      },
    });
    deliveriesCount.delivered = await deliveriesRepo.count({
      where: {
        order: {
          restaurantId,
        },
        createdAt: Between(dateFilter.fromDate, dateFilter.toDate),
        status: EnumDeliveryStatus.DELIVERED,
      },
      relations: {
        order: true,
      },
    });
    deliveriesCount.in_transit = await deliveriesRepo.count({
      where: {
        order: {
          restaurantId,
        },
        createdAt: Between(dateFilter.fromDate, dateFilter.toDate),
        status: EnumDeliveryStatus.IN_TRANSIT,
      },
      relations: {
        order: true,
      },
    });
    return deliveriesCount;
  };
}
