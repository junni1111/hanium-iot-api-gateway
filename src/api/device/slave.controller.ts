import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { ESlaveConfigTopic, TEMPERATURE_WEEK } from '../../util/api-topic';
import { ResponseStatus } from './interfaces/response-status';
import { TemperatureConfigDto } from './dto/temperature-config.dto';
import { LED, TEMPERATURE } from '../../util/constants';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { LedService } from './led.service';
import { TemperatureService } from './temperature.service';
import { WaterPumpService } from './water-pump.service';
import { WATER_PUMP } from '../../util/constants';
import { LedConfigDto } from './dto/led-config.dto';

@Controller('api/device')
export class SlaveController {
  constructor(
    private readonly deviceService: MasterService,
    private readonly temperatureService: TemperatureService,
    private readonly waterPumpService: WaterPumpService,
    private readonly ledService: LedService,
  ) {}

  @ApiTags(TEMPERATURE)
  @Post('slave/config/temperature')
  async setTemperatureConfig(
    @Res() res: Response,
    @Body() temperatureConfigDto: TemperatureConfigDto,
  ) {
    try {
      const result: ResponseStatus =
        await this.temperatureService.setTemperatureConfig(
          temperatureConfigDto,
        );

      return res.status(result.status).json(result);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.TEMPERATURE,
        message: e.message,
      };

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @ApiTags(WATER_PUMP)
  @Post('slave/config/water')
  async setWaterPumpConfig(
    @Res() res: Response,
    @Body() waterConfigDto: WaterPumpConfigDto,
  ) {
    try {
      const result: ResponseStatus =
        await this.waterPumpService.setWaterPumpConfig(waterConfigDto);

      return res.status(result.status).json(result);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.WATER_PUMP,
        message: e.message,
      };

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @ApiTags(LED)
  @Post('slave/config/led')
  async setLedConfig(@Res() res: Response, @Body() ledConfigDto: LedConfigDto) {
    try {
      const result: ResponseStatus = await this.ledService.setLedConfig(
        ledConfigDto,
      );

      return res.status(result.status).json(result);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.LED,
        message: e.message,
      };

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @ApiTags(TEMPERATURE)
  @Get('master/:master_id/slave/:slave_id/temperature/week')
  async getTemperatureOneWeek(
    @Param('master_id') masterId: string,
    @Param('slave_id') slaveId: string,
    @Res() res: Response,
  ) {
    const message = { master_id: masterId, slave_id: slaveId };
    const dto = new DeviceMessageDto(TEMPERATURE_WEEK, JSON.stringify(message));

    const result = await lastValueFrom(this.deviceService.sendMessage(dto));
    console.log(result);
    return res.status(HttpStatus.OK).json(result);
  }

  @ApiTags(TEMPERATURE)
  @Get('master/:master_id/slave/:slave_id/temperature')
  async getTemperature(
    @Param('master_id') masterId: string,
    @Param('slave_id') slaveId: string,
    @Res() res: Response,
  ) {
    /* TODO: Call Device MicroService Temperature Service*/
    const message = { master_id: masterId, slave_id: slaveId };

    console.log(message);
    const dto = new DeviceMessageDto(TEMPERATURE, JSON.stringify(message));

    const result = await lastValueFrom(this.deviceService.sendMessage(dto));
    return res.status(HttpStatus.OK).json(result);
  }
}
