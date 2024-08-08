import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("customers")
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 15 })
  phone: string;

  @Column({ type: "text", nullable: true })
  address: string;
}
