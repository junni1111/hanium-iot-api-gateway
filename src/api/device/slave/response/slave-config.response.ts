import { ApiProperty } from '@nestjs/swagger';

export class SlaveConfigResponse {
  @ApiProperty({ type: 'number', example: 15 })
  rangeBegin: string;

  @ApiProperty({ type: 'number', example: 30 })
  rangeEnd: string;

  @ApiProperty({ type: 'number', example: 30 })
  updateCycle: string;

  @ApiProperty({ type: 'number', example: 3 })
  waterPumpCycle: string;

  @ApiProperty({ type: 'number', example: 10 })
  waterPumpRuntime: string;

  @ApiProperty({ type: 'number', example: 3 })
  ledCycle: string;

  @ApiProperty({ type: 'number', example: 10 })
  ledRuntime: string;
}
