import { IsIn, IsNumber, IsString } from 'class-validator';

/** Abstract OR Partial */
export class SlavePowerDto {
  @IsNumber()
  private masterId: number;

  @IsNumber()
  private slaveId: number;

  @IsString()
  @IsIn(['on', 'off'], {
    message: `'powerState' is not 'on' or 'off'`,
  })
  private powerState: string;
}
