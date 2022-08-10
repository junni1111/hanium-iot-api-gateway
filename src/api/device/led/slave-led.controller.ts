import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LedConfigDto } from './dto/led-config.dto';
import { LedStateDto } from './dto/led-state.dto';
import { LedPowerDto } from './dto/led-power.dto';
import { LedService } from './led.service';
import { MasterService } from '../master/master.service';
import { LED } from '../../../util/constants/swagger';
import { ResponseGeneric } from '../../types/response-generic';

@ApiTags(LED)
@ApiBearerAuth('access-token')
@Controller('api/device-service/led')
export class SlaveLedController {
  constructor(
    private readonly masterService: MasterService,
    private readonly ledService: LedService,
  ) {}

  @ApiOkResponse({
    description: 'LED 전원 상태 API',
    schema: { type: 'string', example: 'on' },
  })
  @Get('state')
  async getLedState(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ): Promise<ResponseGeneric<string>> {
    try {
      const ledState = await this.ledService.getLedState(
        new LedStateDto(masterId, slaveId),
      );

      return res.status(HttpStatus.OK).send(ledState);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: 'LED 설정 API',
    schema: { type: 'string', example: 'ok' },
  })
  @Post('config')
  async setLedConfig(
    @Headers() header: any,
    @Res() res: Response,
    @Body() ledConfigDto: LedConfigDto,
  ): Promise<ResponseGeneric<string>> {
    try {
      const ledConfig = await this.ledService.setLedConfig(ledConfigDto);

      return res.status(HttpStatus.OK).send(ledConfig);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: 'LED 전원 상태 변경 API',
    schema: { type: 'string', example: 'on' },
  })
  @Post('config/power')
  async setPowerConfig(
    @Headers() header: any,
    @Res() res: Response,
    @Body() ledPowerDto: LedPowerDto,
  ): Promise<ResponseGeneric<string>> {
    try {
      const ledPower = await this.ledService.turnLed(ledPowerDto);

      return res.status(HttpStatus.OK).send(ledPower);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: 'LED DB 삭제 API',
    schema: { type: 'string', example: '1' },
  })
  @Delete('db')
  async clearLedDB(@Res() res: Response): Promise<ResponseGeneric<string>> {
    try {
      const result = await this.ledService.clearLedDB();

      return res.status(HttpStatus.OK).send(result.affected.toString());
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }
}
