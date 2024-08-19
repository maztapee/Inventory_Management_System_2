import { Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne,
    ManyToOne, 
    BaseEntity, 
    CreateDateColumn 
} from "typeorm";
import { Order } from "../order/order.entity";
import { Customer } from "../customer/customers.entity";
import { PaymentPlan } from "../paymentplan/paymentplan.entity";

@Entity("refunds")
export class Refund extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "float", nullable: false })
  amount: number; //amount to be paid back to customer

  @Column({ type: "text", nullable: true })
  reason: string;

  @ManyToOne(() => Order, (order) => order.refunds, { nullable: false })
  order: Order;

  @ManyToOne(() => Customer, (customer) => customer.refunds, { nullable: false})
  customer: Customer;

  @OneToOne(() => PaymentPlan, (paymentPlan) => paymentPlan.refunds, { nullable: true })
  paymentPlan: PaymentPlan;
}
