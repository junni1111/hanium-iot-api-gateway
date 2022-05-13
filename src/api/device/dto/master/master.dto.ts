import { IsNumber, IsString, IsDate } from 'class-validator';

export class MasterDto {
  @IsNumber()
  masterId: number;

  @IsString()
  address: string;

  @IsDate()
  createAt: Date;
}
