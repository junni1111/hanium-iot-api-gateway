/*  TODO: Refactoring after change protocol  */
import { PickType } from '@nestjs/swagger';
import { SlaveConfigDto } from '../slave/slave-config.dto';

export class WaterPumpConfigDto extends PickType(SlaveConfigDto, [
  'masterId',
  'slaveId',
  'waterPumpCycle',
  'waterPumpRuntime',
] as const) {}
