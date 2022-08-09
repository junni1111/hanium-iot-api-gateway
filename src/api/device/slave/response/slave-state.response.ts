import { ApiProperty } from '@nestjs/swagger';

export class SlaveStateResponse {
  @ApiProperty({ type: String, example: 'on' })
  waterPumpRunningState: string;

  @ApiProperty({ type: String, example: 'on' })
  waterPumpPowerState: string;

  @ApiProperty({ type: String, example: 'on' })
  ledRunningState: string;

  @ApiProperty({ type: String, example: 'on' })
  ledPowerState: string;

  @ApiProperty({ type: String, example: 'on' })
  fanRunningState: string;

  @ApiProperty({ type: String, example: 'on' })
  fanPowerState: string;
}
