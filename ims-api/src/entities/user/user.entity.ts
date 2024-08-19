import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Generated,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { UserStatus, UserRole, UserMessages } from "../user/constants.user";
import * as bcrypt from "bcrypt";

import { IsNotEmpty, IsEmail, Matches, IsPhoneNumber } from "class-validator";

@Entity()                 
// TODO: Rename table to users and other tables names in plural forms
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  userId: string;

  //TODO:
  //Should we implement full name of users (Admin and Salesperson)

  @Column()
  @IsNotEmpty({
    message: UserMessages.enter_username,
  })
  username: string;

  @Column({ unique: true })
  @IsNotEmpty({
    message: UserMessages.enter_email,
  })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty({
    message: UserMessages.enter_password,
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/, {
    message: UserMessages.password_strength,
  })
  password: string;

  @Column({ unique: true })
  @IsPhoneNumber()
  @IsNotEmpty({
    message: UserMessages.enter_phone_number,
  })
  phone: string;

  @Column({ default: UserStatus.PENDING })
  confirmed: number;

  @Column({ default: UserRole.USER })
  role: number;

  @UpdateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
