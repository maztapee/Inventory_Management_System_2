import { IsNotEmpty } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Product } from "../product/product.entity";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  mainClassification: string;

  @Column()
  @IsNotEmpty()
  subClassification: string;

  @OneToMany(() => Product, (item) => item.category)
  item: Product[];
}
