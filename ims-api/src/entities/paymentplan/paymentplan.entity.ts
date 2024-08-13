import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  BaseEntity, 
  ManyToOne ,
  OneToOne
} from "typeorm";
import { Sale } from "../sales/sales.entity";
import { Customer } from "../customer/customers.entity";

@Entity("payment_plans")
export class PaymentPlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  createdAt: Date; // months only (for now)

  @Column({ type: "float", nullable: false })
  minimumDeposit: number; //percentage of total amount acceptable as initial payment for a payment plan

  @Column({ type: "int", nullable: false })
  duration: number; // months only (for now)

  @Column({ type: "float", nullable: false })
  priceIncrement: number; // Percentage increase

  @Column({ type: "float", nullable: false })
  defaultingFee: number; //Percentage of total amount to be paid 

  @Column({
    type: "enum",
    enum: ["complete", "active", "canceled", "defaulted"],
    default: "active",
  })
  status: string;

  @ManyToOne(() => Sale, (sales) => sales.amountPaid)
  initialAmount: Sale;

  @OneToOne(() => Customer, (customer) => customer.paymentPlan)
  customer: Customer;
}
