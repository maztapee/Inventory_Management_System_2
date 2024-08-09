import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { PaymentStatus } from "./constants.payments";

@Entity("payments")
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: ["Card", "Bank Transfer", "POS", "Cash", "Online Payment"],
  })
  type: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  paymentDate: Date;

  @Column({
    type: "enum",
    enum:PaymentStatus,
    default: PaymentStatus.success,
  })
  status: string;
}
