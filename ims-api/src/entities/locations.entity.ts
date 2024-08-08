import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("locations")
export class Locations extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  address: string;

  @Column({ type: "boolean", default: true })
  isOpen: boolean;
}
