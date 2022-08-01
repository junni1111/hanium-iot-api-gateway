import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { UserRoles } from '../enums/user-role';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: 1234, description: 'User id' })
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty({
    example: 'Example@google.com',
    description: 'User unique email',
  })
  @IsEmail()
  @Index({ unique: true })
  @Column()
  email: string;

  @ApiProperty({ example: 'example', description: 'User password' })
  @Column()
  password: string;

  @ApiProperty({ example: 'example', description: 'User name' })
  @Column()
  username: string;

  @ApiProperty({ example: '010-1234-5678', description: 'User phone number' })
  @Column({ unique: true, name: 'phone_num' })
  phoneNumber: string;

  @ApiProperty({ example: 'admin', description: 'User Auth Role' })
  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.GUEST })
  role: UserRoles;

  @ApiProperty({ example: new Date(), description: 'Date timestamptz' })
  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  createAt: Date;
}
