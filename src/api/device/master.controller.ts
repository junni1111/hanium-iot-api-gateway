import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { CreateMasterDto } from './dto/master/create-master.dto';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { MASTER } from '../../util/constants';
import { POLLING } from '../../util/api-topic';
import { ResponseStatus } from './interfaces/response-status';
import { SlaveService } from './slave.service';

@ApiTags(MASTER)
@Controller('api/device')
export class MasterController {
  constructor(
    private readonly masterService: MasterService,
    private readonly slaveService: SlaveService,
  ) {}

  @Get('master/:master_id/slave/:slave_id/config')
  async fetchConfig(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
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

  @Post('master')
  async createMaster(
    @Res() res: Response,
    @Body() createMasterDto: CreateMasterDto,
  ) {
    try {
      const result = await this.masterService.createMaster(createMasterDto);

      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('optimize/:master_id/:slave_id')
  async optimizeConfig(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    try {
      const message = { master_id: masterId, slave_id: slaveId };
      const dto = new DeviceMessageDto('optimize', JSON.stringify(message));
      const result = await lastValueFrom(this.masterService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  /* TODO: Make Polling DTO*/
  @Get('state/:id')
  async getMasterState(@Param('id') masterId: number, @Res() res: Response) {
    try {
      const dto = new DeviceMessageDto(POLLING, masterId.toString());
      const result = await lastValueFrom(this.masterService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      return e;
    }
  }
}
