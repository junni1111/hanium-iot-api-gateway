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
import { LED } from 'src/util/constants';
import { LedConfigDto } from './dto/led/led-config.dto';
import { LedStateDto } from './dto/led/led-state.dto';
import { LedTurnDto } from './dto/led/led-turn.dto';
import { ResponseStatus } from './interfaces/response-status';
import { LedService } from './led.service';
import { MasterService } from './master.service';

@ApiTags(LED)
@Controller('api/device')
export class SlaveLedController {
  constructor(
    private readonly masterService: MasterService,
    private readonly ledService: LedService,
  ) {}

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
}
