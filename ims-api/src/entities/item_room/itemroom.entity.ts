import { Room } from "../room/room.entity";
import { Product } from "../product/product.entity";
import { Entity, Column, ManyToOne, PrimaryColumn, BaseEntity } from "typeorm";

@Entity()
export class ItemRoom extends BaseEntity {
  @PrimaryColumn()
  itemId: number;

  @PrimaryColumn()
  roomId: number;

  @Column()
  numberOfItem: number;

  @ManyToOne(() => Product, (item) => item.itemRoom)
  item: Product;

  @ManyToOne(() => Room, (room) => room.itemRoom)
  room: Room;
}
