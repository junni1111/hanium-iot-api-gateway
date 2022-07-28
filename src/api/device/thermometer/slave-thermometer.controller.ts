import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic, TEMPERATURE_WEEK } from 'src/util/api-topic';
import { DeviceMessageDto } from '../dto/device-message.dto';
import { ThermometerConfigDto } from '../dto/thermometer/thermometer-config.dto';
import { ResponseStatus } from '../interfaces/response-status';
import { MasterService } from '../master/master.service';
import { ThermometerService } from './thermometer.service';
import { THERMOMETER } from '../../../util/constants/swagger';
import { TemperatureBetweenDto } from '../dto/thermometer/temperature-between.dto';

@ApiTags(THERMOMETER)
@Controller('api/device-service/thermometer')
export class SlaveTemperatureController {
  constructor(
    private readonly masterService: MasterService,
    private readonly thermometerService: ThermometerService,
  ) {}

  @Post('temperature/between')
  async getTemperatures(
    @Headers() header: any,
    @Res() res: Response,
    @Body() dto: TemperatureBetweenDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      const result = await this.thermometerService.getTemperatures(dto);
      Logger.debug(`날짜 범위 온도: `, result);
      Logger.log(result);

      return res.status(result.status).json(result);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: 'temperature/between',
        message: e.message,
      };

      return res.status(response.status).json(response);
    }
  }

  @Get('temperature/now')
  async getCurrentTemperature(
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
      const response = await this.thermometerService.getCurrentTemperature(
        masterId,
        slaveId,
      );

      return res.status(response.status).json(response);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.THERMOMETER,
        message: e.message,
      };
      return res.status(response.status).json(response);
    }
  }

  /** Todo: 재한이한테 URL 수정 알려주기 */
  @Post('temperature/week')
  async getTemperatureOneWeek(
    @Headers() header: any,
    @Res() res: Response,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    const messageDto = new DeviceMessageDto(
      TEMPERATURE_WEEK,
      temperatureBetweenDto,
    );

    const result = await lastValueFrom(
      this.masterService.sendMessage(messageDto),
    );
    console.log(result);
    return res.status(result.status).json(result);
  }

  @Post('config')
  async setThermometerConfig(
    @Headers() header: any,
    @Res() res: Response,
    @Body() thermometerConfigDto: ThermometerConfigDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

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
  async createTestTemperatureData(
    @Headers() header: any,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      const result = await this.thermometerService.createTestData(
        temperatureBetweenDto,
      );
      // console.log(result);
      // console.log(result.data.length);

      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
