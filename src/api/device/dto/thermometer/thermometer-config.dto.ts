import { PickType } from '@nestjs/swagger';
import { SlaveConfigDto } from '../slave/slave-config.dto';

export class ThermometerConfigDto extends PickType(SlaveConfigDto, [
  'masterId',
  'slaveId',
  'startTemperatureRange',
  'endTemperatureRange',
  'temperatureUpdateCycle',
] as const) {}
