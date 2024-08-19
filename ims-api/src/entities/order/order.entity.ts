import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    BaseEntity, 
    ManyToOne, 
    OneToOne, 
    OneToMany 
  } from "typeorm";
  import { Customer } from "../customer/customers.entity";
  import { Sale } from "../sales/sales.entity";
  import { PaymentPlan } from "../paymentplan/paymentplan.entity";
  import { PurchaseType } from "./constants.order";
  import { Refund } from "../refund/refund.entity";
  
  @Entity("orders")
  export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    orderDate: Date;
  
    @Column({ type: "float", nullable: false })
    totalAmount: number;
  
    @ManyToOne(() => Customer, (customer) => customer.orders)
    customer: Customer;
  
    @OneToOne(() => Sale, (sale) => sale.order, { nullable: true })
    sale: Sale;
  
    @OneToMany(() => PaymentPlan, (paymentPlan) => paymentPlan.order, { nullable: true })
    paymentPlans: PaymentPlan | null;

    @OneToMany(() => Refund, (refund) => refund.order, { nullable: true })
    refunds: Refund;
  
    @Column({ type: "enum", 
      enum: PurchaseType, 
      default: PurchaseType.instant, 
      nullable:false
    })
    paymentType: PurchaseType;
  }
  