import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Product} from "../product/product.entity";
import { User } from "../user/user.entity";
import { Customer } from "../customer/customers.entity";
import { SalesStatus } from "../sales/constants.sales";
// import { PaymentPlan } from "../paymentplan/paymentplan.entity";

@Entity("sales")
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => User, (user) => user.id)
  salesPerson: User;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  soldAt: Date;

  @Column({
    type: "enum",
    enum: SalesStatus,
    default: SalesStatus.active,
  })
  status: string;

  @Column({ type: "timestamp", nullable: true })
  nextChargeDate: Date;

  @Column({ type: "float", nullable: false })
  totalAmount: number;

  @Column({ type: "float", nullable: false })
  amountPaid: number;

  @Column({ type: "float", nullable: true })
  amountLeft: number;

  @Column({ type: "timestamp", nullable: true })
  salesStartDate: Date;

  @Column({ type: "timestamp", nullable: true })
  salesEndDate: Date;

  //TODO:  Calculate `amountLeft` using `totalAmount`, `amountPaid`, and surcharge percentage
}
