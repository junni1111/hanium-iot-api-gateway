import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MasterService } from '../master/master.service';
import { FanService } from './fan.service';
import { FanPowerDto } from './dto/fan-power.dto';
import { FAN } from '../../../util/constants/swagger';

@ApiTags(FAN)
@ApiBearerAuth('access-token')
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
    @Body() fanPowerDto: FanPowerDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      console.log(`@@@@@@ Turn Fan Power`);
      const { data } = await this.fanService.turnFan(fanPowerDto);
      return res.status(data.status).json(data);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ result: e });
    }
  }

  @Delete('db')
  async clearFanDB(@Res() res: Response) {
    try {
      const { data } = await this.fanService.clearFanDB();

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'db clear completed',
        data,
      });
    } catch (e) {
      throw e;
    }
  }
}
