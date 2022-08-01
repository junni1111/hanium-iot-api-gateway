import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'email',
  'username',
  'password',
  'phoneNumber',
  'role',
] as const) {}
