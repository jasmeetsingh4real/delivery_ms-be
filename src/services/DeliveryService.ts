import moment = require("moment");
import { dataSource } from "../db/datasource/app_data_source";
import { DeliveriesEntity } from "../entity/deliveries.entity";
import { EnumDeliveryStatus } from "../types/staffTypes";
import { OrdersEntity } from "../entity/orders.entity";
import { EnumOrderStatus } from "../types/RestaurentsTypes";
import { EntityManager } from "typeorm";

export class DeliveryService {
  static getAllDeliveries = async (restaurantId) => {
    const deliveriesRepo = dataSource.getRepository(DeliveriesEntity);

    return deliveriesRepo.find({
      where: {
        order: {
          restaurantId,
        },
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
}
