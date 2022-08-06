import { IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TemperatureBetweenDto {
  @ApiProperty()
  @IsNumber()
  masterId: number;

  @ApiProperty()
  @IsNumber()
  slaveId: number;

  @ApiProperty({
    description: `Date 형식: yyyy-MM-dd | yyyy/MM/dd | new Date()`,
  })
  @Type(() => Date)
  @IsDate()
  begin: Date;

  @ApiProperty({
    description: `Date 형식: yyyy-MM-dd | yyyy/MM/dd | new Date()`,
  })
  @Type(() => Date)
  @IsDate()
  end: Date;
}
