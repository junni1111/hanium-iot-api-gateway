import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class AuthUserDto extends PickType(User, [
  'id',
  'username',
  'email',
  'role',
] as const) {}
