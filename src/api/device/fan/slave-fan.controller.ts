import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MasterService } from '../master/master.service';
import { FanService } from './fan.service';
import { FanPowerDto } from './dto/fan-power.dto';
import { FAN } from '../../../util/constants/swagger';
import { ResponseGeneric } from '../../types/response-generic';

@ApiTags(FAN)
@ApiBearerAuth('access-token')
@Controller('api/device-service/fan')
export class SlaveFanController {
  constructor(
    private readonly masterService: MasterService,
    private readonly fanService: FanService,
  ) {}

  @ApiOkResponse({
    description: 'FAN 전원 상태 변경 API',
    schema: { type: 'string', example: 'ON' },
  })
  @Post('config/power')
  async setPowerFan(
    @Headers() header: any,
    @Res() res: Response,
    @Body() fanPowerDto: FanPowerDto,
  ): Promise<ResponseGeneric<string>> {
    try {
      const fanPower = await this.fanService.turnFan(fanPowerDto);

      return res.status(HttpStatus.OK).send(fanPower);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: 'FAN DB 삭제 API',
    schema: { type: 'string', example: '1' },
  })
  @Delete('db')
  async clearFanDB(@Res() res: Response): Promise<ResponseGeneric<string>> {
    try {
      const result = await this.fanService.clearFanDB();

      return res.status(HttpStatus.OK).send(result);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }
}
