import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { WaterPumpStateDto } from './dto/water-pump-state.dto';
import { WaterPumpPowerDto } from './dto/water-pump-power.dto';
import { MasterService } from '../master/master.service';
import { WaterPumpService } from './water-pump.service';
import { WATER_PUMP } from '../../../util/constants/swagger';
import { ResponseGeneric } from '../../types/response-generic';

@ApiTags(WATER_PUMP)
@ApiBearerAuth('access-token')
@Controller('api/device-service/water-pump')
export class SlaveWaterPumpController {
  constructor(
    private readonly masterService: MasterService,
    private readonly waterPumpService: WaterPumpService,
  ) {}

  @ApiOkResponse({
    description: '물펌프 전원 상태 API',
    schema: { type: 'string', example: 'on' },
  })
  @Get('state')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async getWaterPumpState(
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ): Promise<ResponseGeneric<string>> {
    try {
      const waterPumpState = await this.waterPumpService.getWaterPumpState(
        new WaterPumpStateDto(masterId, slaveId),
      );

      return res.status(HttpStatus.OK).send(waterPumpState);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: '물펌프 설정 API',
    schema: { type: 'string', example: 'ok' },
  })
  @Post('config')
  // @UseGuards(RolesGuard([UserRoles.ADMIN]))
  // @UseGuards(AuthGuard)
  async setWaterPumpConfig(
    @Res() res: Response,
    @Body() waterConfigDto: WaterPumpConfigDto,
  ): Promise<ResponseGeneric<string>> {
    try {
      const waterPumpConfig = await this.waterPumpService.setWaterPumpConfig(
        waterConfigDto,
      );

      return res.status(HttpStatus.OK).send(waterPumpConfig);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: '물펌프 전원 상태 변경 API',
    schema: { type: 'string', example: 'on' },
  })
  @Post('config/power')
  // @UseGuards(RolesGuard([UserRoles.ADMIN]))
  // @UseGuards(AuthGuard)
  async setPowerWaterPump(
    @Res() res: Response,
    @Body() waterPumpPowerDto: WaterPumpPowerDto,
  ): Promise<ResponseGeneric<string>> {
    try {
      const waterPumpPower = await this.waterPumpService.turnWaterPump(
        waterPumpPowerDto,
      );

      return res.status(HttpStatus.OK).send(waterPumpPower);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: '물펌프 DB 삭제 API',
    schema: { type: 'string', example: '1' },
  })
  @Delete('db')
  async clearWaterPumpDB(@Res() res: Response): Promise<ResponseGeneric<any>> {
    try {
      const result = await this.waterPumpService.clearWaterPumpDB();

      return res.status(HttpStatus.OK).send(result.affected.toString());
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }
}
