import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    BaseEntity, 
    ManyToOne, 
    CreateDateColumn 
  } from "typeorm";
  import { Customer } from "../customer/customers.entity";
  
  @Entity("bank_details")
  export class BankDetail extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "varchar", length: 255 })
    bankName: string;
  
    @Column({ type: "varchar", length: 255 })
    accountName: string;
  
    @Column({ type: "varchar", length: 255 })
    accountType: string;
  
    @Column({ type: "varchar", length: 20 })
    accountNumber: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => Customer, (customer) => customer.bankDetails, { onDelete: "CASCADE" })
    customer: Customer;
  }
  