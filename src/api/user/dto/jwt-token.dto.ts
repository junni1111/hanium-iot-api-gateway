import { IsString } from 'class-validator';

export class JwtTokenDto {
  @IsString()
  public accessToken: string;

  @IsString()
  public refreshToken: string;
}
