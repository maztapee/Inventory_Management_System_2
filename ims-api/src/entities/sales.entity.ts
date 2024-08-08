import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { Item } from "./item.entity";
import { User } from "./user.entity";
import { Customer } from "./customers.entity";
import { PaymentPlan } from "./paymentplan.entity";

@Entity("sales")
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (product) => product.id)
  product: Item;

  @ManyToOne(() => User, (user) => user.id)
  salesPerson: User;

  @ManyToOne(() => Customer, (customer) => customer.id)
  customer: Customer;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  soldAt: Date;

  @Column({
    type: "enum",
    enum: ["complete", "active", "canceled", "defaulted"],
    default: "active",
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
