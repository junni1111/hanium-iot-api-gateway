import { ApiProperty, PickType } from '@nestjs/swagger';
import { Master } from '../entities/master.entity';
import { IsObject } from 'class-validator';
import { AuthUserDto } from '../../../user/dto/auth-user.dto';

export class CreateMasterDto extends PickType(Master, [
  'masterId',
  'address',
] as const) {
  @ApiProperty({ nullable: true })
  @IsObject()
  user?: AuthUserDto;
}
