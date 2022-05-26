import { IsNumber } from 'class-validator';

export class SlaveConfigDto {
  @IsNumber()
  masterId: number;

  @IsNumber()
  slaveId: number;

  @IsNumber()
  startThermometerRange: number;

  @IsNumber()
  endThermometerRange: number;

  @IsNumber()
  thermometerUpdateCycle: number;

  @IsNumber()
  waterPumpCycle: number;

  @IsNumber()
  waterPumpRuntime: number;

  @IsNumber()
  ledCycle: number;

  @IsNumber()
  ledRuntime: number;
}
