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
import { WaterPumpPowerDto } from './dto/water-pump/water-pump-power.dto';
import { ResponseStatus } from './interfaces/response-status';
import { MasterService } from './master.service';
import { WaterPumpService } from './water-pump.service';

@ApiTags(WATER_PUMP)
@Controller('api/device-service/water-pump')
export class SlaveWaterPumpController {
  constructor(
    private readonly masterService: MasterService,
    private readonly waterPumpService: WaterPumpService,
  ) {}

  @ApiOkResponse()
  @Get('state/masters/:master_id/slaves/:slave_id')
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

  @Post('config')
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

  @Post('config/power')
  async setPowerWaterPump(
    @Res() res: Response,
    @Body() waterPumpPowerDto: WaterPumpPowerDto,
  ) {
    try {
      const result = await this.waterPumpService.turnWaterPump(
        waterPumpPowerDto,
      );
      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ result: e });
    }
  }
}
