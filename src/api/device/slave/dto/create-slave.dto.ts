import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateSlaveDto {
  constructor(masterId: number, slaveId: number) {
    this.masterId = masterId;
    this.slaveId = slaveId;
  }

  @ApiProperty()
  @IsNumber()
  masterId: number;

  @ApiProperty()
  @IsNumber()
  slaveId: number;
}
