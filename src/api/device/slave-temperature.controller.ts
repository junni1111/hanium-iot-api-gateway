import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic, TEMPERATURE_WEEK } from 'src/util/api-topic';
import { TEMPERATURE } from 'src/util/constants';
import { DeviceMessageDto } from './dto/device-message.dto';
import { TemperatureConfigDto } from './dto/temperature/temperature-config.dto';
import { ResponseStatus } from './interfaces/response-status';
import { MasterService } from './master.service';
import { TemperatureService } from './temperature.service';

@ApiTags(TEMPERATURE)
@Controller('api/device')
export class SlaveTemperatureController {
  constructor(
    private readonly masterService: MasterService,
    private readonly temperatureService: TemperatureService,
  ) {}

  @Get('master/:master_id/slave/:slave_id/temperature/now')
  async getCurrentTemperature(
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
    @Res() res: Response,
  ) {
    try {
      const response = await this.temperatureService.getCurrentTemperature(
        masterId,
        slaveId,
      );

      return res.status(response.status).json(response);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.WATER_PUMP,
        message: e.message,
      };
      return res.status(response.status).json(response);
    }
  }

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

  @Get('master/:master_id/slave/:slave_id/temperature/week')
  async getTemperatureOneWeek(
    @Param('master_id') masterId: string,
    @Param('slave_id') slaveId: string,
    @Res() res: Response,
  ) {
    const message = { master_id: masterId, slave_id: slaveId };
    const dto = new DeviceMessageDto(TEMPERATURE_WEEK, JSON.stringify(message));

    const result = await lastValueFrom(this.masterService.sendMessage(dto));
    console.log(result);
    return res.status(result.status).json(result);
  }

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

    const result = await lastValueFrom(this.masterService.sendMessage(dto));
    return res.status(result.status).json(result);
  }

  @Get('test/temperature')
  async createTestTemperatureData() {
    try {
      const result = await this.temperatureService.createTestData();
      console.log(result);

      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
