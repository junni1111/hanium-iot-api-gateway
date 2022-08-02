import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'masters' })
export class Master {
  @ApiProperty({ example: 1234, description: 'Master id' })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'example', description: 'Example address' })
  @Column({ name: 'username' })
  @IsString()
  address: string;

  @ApiProperty({ example: new Date(), description: 'Date timestamptz' })
  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  @IsDate()
  createAt: Date;
}
