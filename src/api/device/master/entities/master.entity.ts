import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Slave } from '../../slave/entities/slave.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

@Entity('masters')
export class Master {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty({ example: 1234, description: 'Master id' })
  @IsNumber()
  @Column({ unique: true, name: 'master_id' })
  masterId: number;

  @ApiProperty({ example: 'example', description: 'Example address' })
  @Column({ name: 'username' })
  @IsString()
  address: string;

  @ApiProperty({ example: new Date(), description: 'Date timestamptz' })
  @CreateDateColumn({ type: 'timestamptz', name: 'create_at' })
  @IsDate()
  createAt: Date;

  @OneToMany((type) => Slave, (slave) => slave.master, {
    cascade: ['insert', 'update'],
  })
  slaves: Slave[];
}
