import { PartialType } from '@nestjs/mapped-types';
import { Master } from '../entities/master.entity';

export class MasterDto extends PartialType(Master) {}
