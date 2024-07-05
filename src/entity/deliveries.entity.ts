import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EnumDeliveryStatus } from "../types/staffTypes";
@Entity({ name: "deliveries" })
export class DeliveriesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  @Column()
  assignedToStaff: string;

  @Column({
    type: "timestamp",
  })
  pickupTime: Date;

  @Column({
    type: "timestamp",
  })
  deliveryTime: Date;

  @Column()
  deliveryNotes: string;

  @Column({
    type: "enum",
    enum: EnumDeliveryStatus,
  })
  status: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
