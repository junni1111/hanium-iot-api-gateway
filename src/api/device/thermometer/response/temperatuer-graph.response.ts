import { ApiProperty } from '@nestjs/swagger';

export class TemperatureGraphResponse {
  @ApiProperty({ type: 'number', example: 3 })
  id: number;

  @ApiProperty({ type: 'number', example: new Date('1998/11/12/') })
  x: Date;

  @ApiProperty({ type: 'number', example: 27.1 })
  y: number;
}
