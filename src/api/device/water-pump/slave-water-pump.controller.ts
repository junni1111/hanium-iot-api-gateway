import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ESlaveConfigTopic, ESlaveState } from 'src/util/api-topic';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { WaterPumpStateDto } from './dto/water-pump-state.dto';
import { WaterPumpPowerDto } from './dto/water-pump-power.dto';
import { ResponseStatus } from '../interfaces/response-status';
import { MasterService } from '../master/master.service';
import { WaterPumpService } from './water-pump.service';
import { WATER_PUMP } from '../../../util/constants/swagger';
import { RolesGuard } from '../../user/guards/roles.guard';
import { UserRoles } from '../../user/enums/user-role';
import { AuthGuard } from '../../user/guards/auth.guard';

@ApiTags(WATER_PUMP)
@ApiBearerAuth('access-token')
@Controller('api/device-service/water-pump')
export class SlaveWaterPumpController {
  constructor(
    private readonly masterService: MasterService,
    private readonly waterPumpService: WaterPumpService,
  ) {}

  @ApiOkResponse()
  @Get('state')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(AuthGuard)
  async getWaterPumpState(
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    try {
      const { data } = await this.waterPumpService.getWaterPumpState(
        new WaterPumpStateDto(masterId, slaveId),
      );

      return res.status(data.status).json(data);
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
  @UseGuards(RolesGuard([UserRoles.ADMIN]))
  @UseGuards(AuthGuard)
  async setWaterPumpConfig(
    @Res() res: Response,
    @Body() waterConfigDto: WaterPumpConfigDto,
  ) {
    try {
      const { data } = await this.waterPumpService.setWaterPumpConfig(
        waterConfigDto,
      );

      return res.status(data.status).json(data);
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
  @UseGuards(RolesGuard([UserRoles.ADMIN]))
  @UseGuards(AuthGuard)
  async setPowerWaterPump(
    @Res() res: Response,
    @Body() waterPumpPowerDto: WaterPumpPowerDto,
  ) {
    try {
      const { data } = await this.waterPumpService.turnWaterPump(
        waterPumpPowerDto,
      );
      return res.status(data.status).json(data);
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ result: e });
    }
  }

  @Delete('db')
  async clearWaterPumpDB(@Res() res: Response) {
    try {
      const { data } = await this.waterPumpService.clearWaterPumpDB();

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'db clear completed',
        data,
      });
    } catch (e) {
      throw e;
    }
  }
}
