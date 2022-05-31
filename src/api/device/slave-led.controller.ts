import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ESlaveConfigTopic, ESlaveState } from 'src/util/api-topic';
import { LED } from 'src/util/constants';
import { LedConfigDto } from './dto/led/led-config.dto';
import { LedStateDto } from './dto/led/led-state.dto';
import { LedPowerDto } from './dto/led/led-power.dto';
import { ResponseStatus } from './interfaces/response-status';
import { LedService } from './led.service';
import { MasterService } from './master.service';

@ApiTags(LED)
@Controller('api/device-service/led')
export class SlaveLedController {
  constructor(
    private readonly masterService: MasterService,
    private readonly ledService: LedService,
  ) {}

  @ApiOkResponse()
  @Get('state/masters/:master_id/slaves/:slave_id')
  async getLedState(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    console.log(`Call Led State`);
    try {
      const result = await this.ledService.getLedState(
        new LedStateDto(masterId, slaveId),
      );

      return res.status(result.status).json(result);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveState.LED,
        message: `slave state exception`,
      };

      return res.status(response.status).json(response);
    }
  }

  @ApiOkResponse()
  @Post('config')
  async setLedConfig(@Res() res: Response, @Body() ledConfigDto: LedConfigDto) {
    try {
      console.log(`call led config`);
      console.log(ledConfigDto);
      const result: ResponseStatus = await this.ledService.setLedConfig(
        ledConfigDto,
      );

      return res.status(result.status).json(result);
    } catch (e) {
      console.log(`catch led config error : `, e);
      const response: ResponseStatus = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        topic: ESlaveConfigTopic.LED,
        message: e.message,
      };

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  @ApiOkResponse()
  @Post('config/power')
  async setPowerConfig(@Res() res: Response, @Body() ledPowerDto: LedPowerDto) {
    try {
      const result = await this.ledService.turnLed(ledPowerDto);
      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ result: e });
    }
  }
}
