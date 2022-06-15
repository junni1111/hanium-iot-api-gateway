import { Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveState } from '../../util/api-topic';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { CreateSlaveDto } from './dto/slave/create-slave.dto';
import { SlaveStateDto } from './dto/slave/slave-state.dto';
import {SLAVE} from "../../util/constants/swagger";

@Controller('api/device-service')
export class SlaveController {
  constructor(private readonly masterService: MasterService) {}

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
}
