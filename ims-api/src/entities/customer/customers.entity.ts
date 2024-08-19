import { 
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Generated,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from "typeorm";
import bcrypt from "bcrypt";
import { PaymentPlan } from "../paymentplan/paymentplan.entity";
import { BankDetail } from "../bankdetail/bankdetail.entity";
import { Order } from "../order/order.entity";
import { Refund } from "../refund/refund.entity";

@Entity("customers")
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  username: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 15 })
  phone: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @OneToOne(() => PaymentPlan, (paymentPlan) => paymentPlan.customer, { nullable: true })
  @JoinColumn()
  paymentPlan: PaymentPlan | null;

  @OneToMany(() => BankDetail, (bankDetail) => bankDetail.customer, { nullable: true })
  bankDetails: BankDetail[];

  @OneToMany(() => Refund, (refund) => refund.customer, { nullable: false })
  refunds: Refund[];

  @OneToMany(() => Order, (order) => order.customer, { nullable: true })
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
