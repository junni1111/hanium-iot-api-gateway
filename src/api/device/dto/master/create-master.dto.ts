import { PickType } from '@nestjs/swagger';
import { MasterDto } from './master.dto';

export class CreateMasterDto extends PickType(MasterDto, [
  'masterId',
  'address',
] as const) {}
