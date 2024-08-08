import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Sales } from "./sales.entity";

@Entity("payment_plans")
export class PaymentPlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "float", nullable: false })
  minimumDeposit: number;

  @Column({ type: "int", nullable: false })
  minDuration: number; // In days, weeks, or months

  @Column({ type: "int", nullable: false })
  maxDuration: number; // In days, weeks, or months

  @Column({ type: "float", nullable: false })
  priceIncrement: number; // Percentage increase

  @Column({ type: "float", nullable: false })
  defaultingFee: number;

  @Column({
    type: "enum",
    enum: ["complete", "active", "canceled", "defaulted"],
    default: "active",
  })
  status: string;

  @ManyToOne(() => Sales, (sales) => sales.amountPaid)
  initialAmount: Sales;
}
