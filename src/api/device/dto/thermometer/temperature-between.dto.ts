import { IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TemperatureBetweenDto {
  @ApiProperty()
  @IsNumber()
  masterId: number;

  @ApiProperty()
  @IsNumber()
  slaveId: number;

  @ApiProperty()
  @IsDateString()
  begin: string;

  @ApiProperty()
  @IsDateString()
  end: string;
}
