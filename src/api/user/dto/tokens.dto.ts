import { IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AuthUserDto } from './auth-user.dto';

export class TokensDto {
  @Expose()
  @ApiProperty()
  @IsObject()
  user: AuthUserDto;

  @Expose()
  @ApiProperty()
  @IsString()
  accessToken: string;

  @Exclude()
  @IsString()
  refreshToken: string;
}
