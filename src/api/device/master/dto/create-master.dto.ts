import { ApiProperty, PickType } from '@nestjs/swagger';
import { Master } from '../entities/master.entity';
import { AuthUserDto } from '../../../user/dto/auth-user.dto';
import { IsObject } from 'class-validator';

export class CreateMasterDto extends PickType(Master, [
  'masterId',
  'address',
] as const) {
  @IsObject()
  user?: AuthUserDto;
}
