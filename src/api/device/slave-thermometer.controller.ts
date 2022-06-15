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
import { DeviceMessageDto } from './dto/device-message.dto';
import { ThermometerConfigDto } from './dto/thermometer/thermometer-config.dto';
import { ResponseStatus } from './interfaces/response-status';
import { MasterService } from './master.service';
import { ThermometerService } from './thermometer.service';
import { SlaveStateDto } from './dto/slave/slave-state.dto';
import {THERMOMETER} from "../../util/constants/swagger";

@ApiTags(THERMOMETER)
@Controller('api/device-service/thermometer')
export class SlaveTemperatureController {
  constructor(
    private readonly masterService: MasterService,
    private readonly thermometerService: ThermometerService,
  ) {}

  @Get('temperature/now/masters/:master_id/slaves/:slave_id')
  async getCurrentTemperature(
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
    @Res() res: Response,
  ) {
    try {
      const response = await this.thermometerService.getCurrentTemperature(
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

  @Get('temperature/week/masters/:master_id/slaves/:slave_id/')
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

  @Get('state/masters/:master_id/slaves/:slave_id/')
  async getTemperature(
    @Param('master_id') masterId: string,
    @Param('slave_id') slaveId: string,
    @Res() res: Response,
  ) {
    /* TODO: Call Device MicroService Temperature Service*/
    const message = { master_id: masterId, slave_id: slaveId };

    console.log(message);
    const dto = new DeviceMessageDto(THERMOMETER, JSON.stringify(message));

    const result = await lastValueFrom(this.masterService.sendMessage(dto));
    return res.status(result.status).json(result);
  }

  @Post('config')
  async setThermometerConfig(
    @Res() res: Response,
    @Body() thermometerConfigDto: ThermometerConfigDto,
  ) {
    try {
      const result: ResponseStatus =
        await this.thermometerService.setThermometerConfig(
          thermometerConfigDto,
        );

      return res.status(result.status).json(result);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.THERMOMETER,
        message: e.message,
      };

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @Post('test/temperature')
  async createTestTemperatureData(@Body() slaveStateDto: SlaveStateDto) {
    try {
      const result = await this.thermometerService.createTestData(
        slaveStateDto,
      );
      console.log(result);

      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
