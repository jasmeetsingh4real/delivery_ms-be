export enum EnumStaffRoles {
  DELIVERY = "delivery",
  ADMIN = "admin",
  EMPLOYEE = "employee",
  CHEF = "chef",
}

export interface IRestaurantStaff {
  staffName: string;
  restaurantId: string;
  role: EnumStaffRoles;
  age: number;
  phoneNo: string;
  email: string;
  isActive: boolean;
  salary: number;
}

export enum EnumDeliveryStatus {
  PENDING = "pending",
  BEING_PREPARED = "being_prepared",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  FAILED = "failed",
}
