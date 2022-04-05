import { PickType } from '@nestjs/swagger';
import { SlaveConfigDto } from './slave-config.dto';

export class TemperatureConfigDto extends PickType(SlaveConfigDto, [
  'masterId',
  'slaveId',
  'startTemperatureRange',
  'endTemperatureRange',
  'temperatureUpdateCycle',
] as const) {}
