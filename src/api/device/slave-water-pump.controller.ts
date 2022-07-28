import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ESlaveConfigTopic, ESlaveState } from 'src/util/api-topic';
import { WaterPumpConfigDto } from './dto/water-pump/water-pump-config.dto';
import { WaterPumpStateDto } from './dto/water-pump/water-pump-state.dto';
import { WaterPumpPowerDto } from './dto/water-pump/water-pump-power.dto';
import { ResponseStatus } from './interfaces/response-status';
import { MasterService } from './master.service';
import { WaterPumpService } from './water-pump.service';
import { WATER_PUMP } from '../../util/constants/swagger';

@ApiTags(WATER_PUMP)
@Controller('api/device-service/water-pump')
export class SlaveWaterPumpController {
  constructor(
    private readonly masterService: MasterService,
    private readonly waterPumpService: WaterPumpService,
  ) {}

  @ApiOkResponse()
  @Get('state')
  async getWaterPumpState(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    const jwt = header['authorization']?.split(' ')[1];

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
    @Headers() header: any,
    @Res() res: Response,
    @Body() waterConfigDto: WaterPumpConfigDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];

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
    @Headers() header: any,
    @Res() res: Response,
    @Body() waterPumpPowerDto: WaterPumpPowerDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];

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
