import { PickType } from '@nestjs/swagger';
import { SlaveConfigDto } from '../../slave/dto/slave-config.dto';

export class ThermometerConfigDto extends PickType(SlaveConfigDto, [
  'masterId',
  'slaveId',
  'rangeBegin',
  'rangeEnd',
  'updateCycle',
] as const) {}
