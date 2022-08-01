import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { UserRoles } from '../enums/user-role';

export class UserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsEnum(UserRoles)
  role: UserRoles;

  @ApiProperty()
  @IsArray()
  masterIds: number[];

  @ApiProperty()
  @IsArray()
  slaveIds: number[];
}
