import {
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
import { ESlaveState } from '../../util/api-topic';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { CreateSlaveDto } from './dto/slave/create-slave.dto';
import { SlaveStateDto } from './dto/slave/slave-state.dto';
import { SLAVE } from '../../util/constants/swagger';
import { ResponseStatus } from './interfaces/response-status';
import { SlaveService } from './slave.service';

@ApiTags(SLAVE)
@Controller('api/device-service/slave')
export class SlaveController {
  constructor(
    private masterService: MasterService,
    private slaveService: SlaveService,
  ) {}

  /* Todo: Refactor URL path */

  @Post()
  async createSlave(
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
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

  @Get('state')
  async getSensorsState(
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    const message = new DeviceMessageDto(
      ESlaveState.ALL,
      new SlaveStateDto(masterId, slaveId),
    );
    const result = await lastValueFrom(this.masterService.sendMessage(message));

    return res.status(HttpStatus.OK).json(result);
  }

  @Get('config')
  async fetchConfig(
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    try {
      const slaveConfigs = await this.slaveService.getSlaveConfigs(
        masterId,
        slaveId,
      );

      const result: ResponseStatus = {
        status: HttpStatus.OK,
        topic: `configs`,
        message: `success get slave configs`,
        data: slaveConfigs,
      };

      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
    }
  }
}
