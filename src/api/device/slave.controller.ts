import {
  Body,
  Controller,
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
  ESlaveConfigTopic,
  ESlaveState,
  TEMPERATURE_WEEK,
} from '../../util/api-topic';
import { ResponseStatus } from './interfaces/response-status';
import { TemperatureConfigDto } from './dto/temperature/temperature-config.dto';
import { LED, SLAVE, TEMPERATURE, WATER_PUMP } from '../../util/constants';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { LedService } from './led.service';
import { TemperatureService } from './temperature.service';
import { WaterPumpService } from './water-pump.service';
import { LedConfigDto } from './dto/led/led-config.dto';
import { CreateSlaveDto } from './dto/slave/create-slave.dto';
import { LedTurnDto } from './dto/led/led-turn.dto';
import { EPowerState } from '../../util/api-topic';
import { WaterPumpTurnDto } from './dto/water-pump/water-pump-turn.dto';
import { LedStateDto } from './dto/led/led-state.dto';
import { WaterPumpStateDto } from './dto/water-pump/water-pump-state.dto';
import { SlaveStateDto } from './dto/slave/slave-state.dto';

/**
 * Todo: Split Slave Controller
 *       -> Temperature,
 *          WaterPump,
 *          Led */
@Controller('api/device')
export class SlaveController {
  constructor(
    private readonly masterService: MasterService,
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
  @Get('master/:master_id/slave/:slave_id/led/state')
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

  /**
   * Todo: Extract Controller*/
  /**
   * Todo: Post로 바꿔야함 */
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
    console.log(`Turn LED Controller: `, powerState);
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
  @Get('master/:master_id/slave/:slave_id/water/state')
  async getWaterPumpState(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    try {
      const result = await this.waterPumpService.getWaterPumpState(
        new WaterPumpStateDto(masterId, slaveId),
      );

      return res.status(result.status).json(result);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveState.WATER_PUMP,
        message: `slave state exception`,
      };

      return res.status(response.status).json(response);
    }
  }

  /**
   * Todo: Extract Controller*/
  /**
   * Todo: Change Get -> Post
   **/
  @ApiTags(WATER_PUMP)
  @ApiOkResponse()
  @ApiQuery({ name: 'power', enum: EPowerState })
  @Get('master/:master_id/slave/:slave_id/water')
  async turnWaterPump(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
    /** Todo: Make Dto*/
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

    const result = await lastValueFrom(this.masterService.sendMessage(dto));
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

    const result = await lastValueFrom(this.masterService.sendMessage(dto));
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
      const result = await this.masterService.createSlave(
        new CreateSlaveDto(masterId, slaveId),
      );

      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  @ApiTags(SLAVE)
  @Get('master/:master_id/slave/:slave_id/state')
  async getSensorsState(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    const message = new DeviceMessageDto(
      ESlaveState.ALL,
      new SlaveStateDto(masterId, slaveId),
    );
    const result = await lastValueFrom(this.masterService.sendMessage(message));

    return res.status(HttpStatus.OK).json(result);
  }

  @ApiTags(TEMPERATURE)
  @Post('test/temperature')
  async createTestTemperatureData(
    @Res() res: Response,
    // @Body() slaveStateDto: SlaveStateDto,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    try {
      console.log(`slave state: `, masterId, slaveId);

      const result = await this.temperatureService.createTestData(
        new SlaveStateDto(masterId, slaveId),
      );
      console.log(result);

      return res.status(result.status).send(result);
    } catch (e) {
      console.log(e);
    }
  }
}
