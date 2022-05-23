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
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  EPowerState,
  ESlaveConfigTopic,
  ESlaveState,
} from 'src/util/api-topic';
import { WATER_PUMP } from 'src/util/constants';
import { WaterPumpConfigDto } from './dto/water-pump/water-pump-config.dto';
import { WaterPumpStateDto } from './dto/water-pump/water-pump-state.dto';
import { WaterPumpTurnDto } from './dto/water-pump/water-pump-turn.dto';
import { ResponseStatus } from './interfaces/response-status';
import { MasterService } from './master.service';
import { WaterPumpService } from './water-pump.service';

@ApiTags(WATER_PUMP)
@Controller('api/device')
export class SlaveWaterPumpController {
  constructor(
    private readonly masterService: MasterService,
    private readonly waterPumpService: WaterPumpService,
  ) {}

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

  /**
   * Todo: Extract Controller*/
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
}
