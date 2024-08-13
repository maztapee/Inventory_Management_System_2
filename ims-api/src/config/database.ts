import "reflect-metadata";
import { ItemRoom } from "../entities/item_room/itemroom.entity";
import { User } from "../entities/user/user.entity";
import { DataSource } from "typeorm";
import { Department } from "../entities/department/department.entity";
import { Room } from "../entities/room/room.entity";
import { Product } from "../entities/product/product.entity";
import {Locations} from "../entities/locations/locations.entity";
import {Customer} from "../entities/customer/customers.entity";
import {PaymentPlan} from "../entities/paymentplan/paymentplan.entity";
import { Payment } from "../entities/payments/payments.entity";
import { Sale } from "../entities/sales/sales.entity";
import { Category } from "../entities/category/category.entity";
import { config } from "dotenv";
config();
export const Database = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Department, Room, Product, Category, ItemRoom, Locations, Customer, PaymentPlan,Payment, Sale],
  migrations: [/*...*/],
  migrationsTableName: "custom_migration_table",

});


