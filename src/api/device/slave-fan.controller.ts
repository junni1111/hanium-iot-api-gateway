import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MasterService } from './master.service';
import { FanService } from './fan.service';
import { SlavePowerDto } from './dto/slave/slave-power.dto';
import { FAN } from '../../util/constants/swagger';

@ApiTags(FAN)
@Controller('api/device-service/fan')
export class SlaveFanController {
  constructor(
    private readonly masterService: MasterService,
    private readonly fanService: FanService,
  ) {}

  @Post('config/power')
  async setPowerFan(
    @Headers() header: any,
    @Res() res: Response,
    @Body() fanPowerDto: SlavePowerDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];

    try {
      console.log(`@@@@@@ Turn Fan Power`);
      const result = await this.fanService.turnFan(fanPowerDto);
      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ result: e });
    }
  }
}
