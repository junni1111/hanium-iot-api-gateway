import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { WaterPumpConfigDto } from './dto/water-pump/water-pump-config.dto';
import {
  ESensor,
  ESlaveConfigTopic,
  TEMPERATURE_WEEK,
} from '../../util/api-topic';
import { ResponseStatus } from './interfaces/response-status';
import { TemperatureConfigDto } from './dto/temperature/temperature-config.dto';
import { LED, TEMPERATURE, WATER_PUMP } from '../../util/constants';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { LedService } from './led.service';
import { TemperatureService } from './temperature.service';
import { WaterPumpService } from './water-pump.service';
import { LedConfigDto } from './dto/led/led-config.dto';
import { CreateSlaveDto } from './dto/slave/create-slave.dto';
import { LedTurnDto } from './dto/led/led-turn.dto';
// import { EPowerState } from './interfaces/sensor';
import { EPowerState } from '../../util/api-topic';
import { EnumValidationPipe } from './pipes/sensor-validate.pipe';
import { WaterPumpTurnDto } from './dto/water-pump/water-pump-turn.dto';
// import { SensorValidatePipe } from './pipes/sensor-validate.pipe';

class WaterPumpTurnDt extends WaterPumpTurnDto {}

@Controller('api/device')
export class SlaveController {
  constructor(
    private readonly deviceService: MasterService,
    private readonly temperatureService: TemperatureService,
    private readonly waterPumpService: WaterPumpService,
    private readonly ledService: LedService,
  ) {}

  /* Todo: Change url */
  @ApiTags(TEMPERATURE)
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
  @ApiOkResponse()
  @Post('slave/config/led')
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

  /**
   * Todo: Extract Controller*/
  @ApiTags(LED)
  @ApiOkResponse()
  @ApiQuery({ name: 'power', enum: EPowerState })
  @Get('master/:master_id/slave/:slave_id/led')
  async turnLed(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
    @Query('power')
    powerState: string,
  ) {
    switch (powerState) {
      /*Fall Through*/
      case EPowerState.OFF:
      case EPowerState.ON:
        try {
          const result = await this.ledService.turnLed(
            new LedTurnDto(masterId, slaveId, powerState),
          );
          return res.status(result.status).json(result);
        } catch (e) {
          console.log(e);
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ result: e });
        }

      default:
        const response: ResponseStatus = {
          status: HttpStatus.BAD_REQUEST,
          topic: ESlaveConfigTopic.LED,
          message: `query param 'power' is not 'on' or 'off'`,
        };
        return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  /**
   * Todo: Extract Controller*/
  @ApiTags(WATER_PUMP)
  @ApiOkResponse()
  @ApiQuery({ name: 'power', enum: EPowerState })
  @Get('master/:master_id/slave/:slave_id/water')
  async turnWaterPump(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
    @Query('power')
    powerState: string,
  ) {
    switch (powerState) {
      /*Fall Through*/
      case EPowerState.OFF:
      case EPowerState.ON:
        try {
          const result = await this.waterPumpService.turnWaterPump(
            new WaterPumpTurnDto(masterId, slaveId, powerState),
          );
          return res.status(result.status).json(result);
        } catch (e) {
          console.log(e);
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ result: e });
        }

      default:
        const response: ResponseStatus = {
          status: HttpStatus.BAD_REQUEST,
          topic: ESlaveConfigTopic.WATER_PUMP,
          message: `query param 'power' is not 'on' or 'off'`,
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
    return res.status(result.status).json(result);
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
    return res.status(result.status).json(result);
  }

  /* Todo: Refactor URL path */
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

  @ApiTags(TEMPERATURE)
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
