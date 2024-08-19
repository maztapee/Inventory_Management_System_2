import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToOne, 
  BaseEntity, 
  JoinColumn 
} from "typeorm";
import { Product } from "../product/product.entity";
import { User } from "../user/user.entity";
import { Customer } from "../customer/customers.entity";
import { SalesStatus } from "../sales/constants.sales";
import { PaymentPlan } from "../paymentplan/paymentplan.entity";
import { Order } from "../order/order.entity";

@Entity("sales")
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  soldAt: Date;

  @Column({
    type: "enum",
    enum: SalesStatus,
    default: SalesStatus.success,
  })
  status: SalesStatus;

  @Column({ type: "float", nullable: false })
  amount: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  salesPerson: User;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  @OneToOne(() => Order, (order) => order.sale, { nullable: true })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => PaymentPlan, (paymentPlan) => paymentPlan.amountPaid, { nullable: true })
  paymentPlan: PaymentPlan;
}