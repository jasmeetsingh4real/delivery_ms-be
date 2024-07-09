import { z } from "zod";
import { EnumDeliveryStatus } from "../types/RestaurentsTypes";

export const updateDeliveryStatusSchema = z.object({
  status: z.nativeEnum(EnumDeliveryStatus),
  restaurantId: z.string().min(1),
  deliveryId: z.number(),
});
