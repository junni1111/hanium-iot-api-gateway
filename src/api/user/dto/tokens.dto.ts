import { IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class TokensDto {
  @Expose()
  @ApiProperty()
  @IsObject()
  userId: number;

  @Expose()
  @ApiProperty()
  @IsString()
  accessToken: string;

  @Exclude()
  @IsString()
  refreshToken: string;
}
