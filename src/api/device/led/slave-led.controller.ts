import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ESlaveConfigTopic, ESlaveState } from '../../../util/api-topic';
import { LedConfigDto } from './dto/led-config.dto';
import { LedStateDto } from './dto/led-state.dto';
import { LedPowerDto } from './dto/led-power.dto';
import { ResponseStatus } from '../interfaces/response-status';
import { LedService } from './led.service';
import { MasterService } from '../master/master.service';
import { LED } from '../../../util/constants/swagger';

@ApiTags(LED)
@ApiBearerAuth('access-token')
@Controller('api/device-service/led')
export class SlaveLedController {
  constructor(
    private readonly masterService: MasterService,
    private readonly ledService: LedService,
  ) {}

  @ApiOkResponse()
  @Get('state')
  async getLedState(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      const { data } = await this.ledService.getLedState(
        new LedStateDto(masterId, slaveId),
      );

      return res.status(data.status).json(data);
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
  async setLedConfig(
    @Headers() header: any,
    @Res() res: Response,
    @Body() ledConfigDto: LedConfigDto,
  ) {
    // const jwt = header['authorization']?.split(' ')[1];
    // if (!jwt) {
    //   throw new NotFoundException('Jwt Not Found');
    // }

    console.log(`Call led config`);
    try {
      console.log(`call led config`);
      console.log(ledConfigDto);
      const data = await this.ledService.setLedConfig(ledConfigDto);

      return res.status(data.status).json(data);
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
  async setPowerConfig(
    @Headers() header: any,
    @Res() res: Response,
    @Body() ledPowerDto: LedPowerDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      const { data } = await this.ledService.turnLed(ledPowerDto);
      return res.status(data.status).json(data);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ result: e });
    }
  }

  @Delete('db')
  async clearLedDB(@Res() res: Response) {
    try {
      const { data } = await this.ledService.clearLedDB();

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
