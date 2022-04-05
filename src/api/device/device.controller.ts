import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { Response } from 'express';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { ESlaveConfigTopic, TEMPERATURE_WEEK } from '../../util/api-topic';
import { ResponseStatus } from './interfaces/response-status';
import { TemperatureConfigDto } from './dto/temperature-config.dto';
import { LedConfigDto } from './dto/led-config.dto';
import { CreateMasterDto } from './dto/create-master.dto';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { TEMPERATURE } from '../../util/mqtt-topic';

@Controller('api/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  //
  // @Get('test')
  // async testGateway(@Res() res: Response, @Body() ledConfigDto: LedConfigDto) {
  //   const result = await lastValueFrom(this.deviceService.sendMessage(message));
  //
  //   return res.status(HttpStatus.OK).json(result);
  // }

  @Get('master/:master_id/slave/:slave_id/state')
  async getSlaveState(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    const message = new DeviceMessageDto(
      'slave/state',
      JSON.stringify({ master_id: masterId, slave_id: slaveId }),
    );
    const result = await lastValueFrom(this.deviceService.sendMessage(message));

    return res.status(HttpStatus.OK).json(result);
  }

  @Post('slave/config/temperature')
  async setTemperatureConfig(
    @Res() res: Response,
    @Body() temperatureConfigDto: TemperatureConfigDto,
  ) {
    try {
      const result: ResponseStatus =
        await this.deviceService.setTemperatureConfig(temperatureConfigDto);

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

  @Post('slave/config/water')
  async setWaterPumpConfig(
    @Res() res: Response,
    @Body() waterConfigDto: WaterPumpConfigDto,
  ) {
    try {
      const result: ResponseStatus =
        await this.deviceService.setWaterPumpConfig(waterConfigDto);

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

  @Post('slave/config/led')
  async setLedConfig(@Res() res: Response, @Body() ledConfigDto: LedConfigDto) {
    try {
      const result: ResponseStatus = await this.deviceService.setLedConfig(
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

  @Get('master/:master_id/slave/:slave_id/config')
  async fetchConfig(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    try {
      /*  TODO: Send Message To Device Microservice  */
      const message = { master_id: masterId, slave_id: slaveId };
      const dto = new DeviceMessageDto('config', JSON.stringify(message));
      const result = await lastValueFrom(this.deviceService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  @Post('master')
  async createMaster(
    @Res() res: Response,
    @Body() createMasterDto: CreateMasterDto,
  ) {
    try {
      const result = await this.deviceService.createMaster(createMasterDto);

      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  @Post('slave/:master_id/:slave_id')
  async createSlave(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    try {
      const result = await this.deviceService.createSlave(
        new CreateSlaveDto(masterId, slaveId),
      );

      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('optimize/:master_id/:slave_id')
  async optimizeConfig(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    try {
      const message = { master_id: masterId, slave_id: slaveId };
      const dto = new DeviceMessageDto('optimize', JSON.stringify(message));
      const result = await lastValueFrom(this.deviceService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  /* TODO: Make Polling DTO*/
  @Get('state/:id')
  async getMasterState(@Param('id') masterId: number, @Res() res: Response) {
    try {
      console.log(`from front: `, masterId);
      const dto = new DeviceMessageDto('master/+/polling', masterId.toString());
      const result = await lastValueFrom(this.deviceService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      return e;
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

    const result = await lastValueFrom(this.deviceService.sendMessage(dto));
    console.log(result);
    return res.status(HttpStatus.OK).json(result);
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

    const result = await lastValueFrom(this.deviceService.sendMessage(dto));
    return res.status(HttpStatus.OK).json(result);
  }
}
