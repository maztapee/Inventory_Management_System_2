import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  BaseEntity, 
  ManyToOne ,
  OneToMany,
  OneToOne
} from "typeorm";
import { Sale } from "../sales/sales.entity";
import { Customer } from "../customer/customers.entity";
import { Order } from "../order/order.entity";
import { PaymentPlanStatus } from "./constants.paymentplan";
import { Refund } from "../refund/refund.entity";

@Entity("payment_plans")
export class PaymentPlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: false })
  createdAt: Date; //

  @Column({ type: "float", nullable: false })
  minimumDeposit: number; //percentage of total amount acceptable as initial payment for a payment plan

  @Column({ type: "float", nullable: false })
  initialDeposit: number; //initial payment for a payment plan


  @Column({ type: "int", nullable: false })
  duration: number; // combination of weeks and months duration

  @Column({ type: "float", nullable: false })
  priceIncrement: number; // Percentage increase

  @Column({ type: "float", nullable: false })
  paymentPlanAmount: number; // total amount to be paid by customer for this paymentPlan duration

  @Column({ type: "float", nullable: false })
  monthlyPaymentPlanAmount: number; // monthly spread of paymentPlanAmount

  @Column({ type: "int", nullable: false })
  nextChargeDate: Date; // next periodic date for monthly payment

  @Column({ type: "float", nullable: false })
  defaultingFee: number; //Percentage of total amount to be paid when a customer default on a paymentplan

  @Column({
    type: "enum",
    enum: PaymentPlanStatus,
    default: PaymentPlanStatus.active,
  })
  status: PaymentPlanStatus;

  @ManyToOne(() => Sale, (sales) => sales.amount)
  amountPaid: number;

  @OneToOne(() => Refund, (refund) => refund.paymentPlan, {nullable: true})
  refunds: number;

  @OneToOne(() => Customer, (customer) => customer.paymentPlan, {nullable: false})
  customer: Customer;

  @ManyToOne(() => Order, (order) => order.paymentPlans, {nullable: false})
  order: Order;
}
