import { ItemRoom } from "../item_room/itemroom.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Category } from "../category/category.entity";
import { IsNotEmpty } from "class-validator";
import { DefaultImage } from "./constants.products";
import { DefaultDescription } from "./constants.products";
import { DefaultFeature } from "./constants.products";

@Entity("products")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ type: "int", nullable: false, default: 0 })
  quantity: number;

  @Column("simple-array", { default: DefaultImage.default })
  images: string[];

  @Column({ type: "float", default: 0 })
  unitPrice: number;

  @Column({ type: "boolean", default: false }) // Indicator for product availability
  available: boolean;

  @Column({ default: 0 }) // For discounted sales or clearouts 
  discount: number; 

  @Column({ nullable: false, default: DefaultDescription.default }) // Product description
  description: string;

  @Column("simple-array", { default: DefaultFeature.default }) // Product features
  features: string[];

  @Column({ type: "int", nullable: false }) // ID of the user/admin who added this product
  //TODO: Define the relationship with user currently logged in
  addedBy: number;

  @ManyToOne(() => Category, (Category) => Category.item, {
    onDelete: "SET NULL",
  })
  category: Category;

  @OneToMany(() => ItemRoom, (itemRoom) => itemRoom.item)
  itemRoom: ItemRoom[];
}


//NOTE: Item entity is created to represents product. Will change to product across code base in the future