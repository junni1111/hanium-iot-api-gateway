import { IsNumber } from 'class-validator';
export class CreateSlaveDto {
  @IsNumber()
  masterId: number;

  @IsNumber()
  slaveId: number;

  constructor(masterId: number, slaveId: number) {
    this.masterId = masterId;
    this.slaveId = slaveId;
  }
}
