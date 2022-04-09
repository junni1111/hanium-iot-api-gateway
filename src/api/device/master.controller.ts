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
import { CreateMasterDto } from './dto/create-master.dto';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { MASTER } from '../../util/constants';

@ApiTags(MASTER)
@Controller('api/device')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get('master/:master_id/slave/:slave_id/state')
  async getSlaveState(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    const message = new DeviceMessageDto(
      'slave/state',
      JSON.stringify({ master_id: masterId, slave_id: slaveId }),
    );
    const result = await lastValueFrom(this.masterService.sendMessage(message));

    return res.status(HttpStatus.OK).json(result);
  }

  @Get('master/:master_id/slave/:slave_id/config')
  async fetchConfig(
    @Res() res: Response,
    @Param('master_id') masterId: number,
    @Param('slave_id') slaveId: number,
  ) {
    try {
      /*  TODO: Send Message To Device Microservice  */
      const message = { master_id: masterId, slave_id: slaveId };
      const dto = new DeviceMessageDto('config', JSON.stringify(message));
      const result = await lastValueFrom(this.masterService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
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
      console.log(`from front: `, masterId);
      const dto = new DeviceMessageDto('master/+/polling', masterId.toString());
      const result = await lastValueFrom(this.masterService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      return e;
    }
  }
}
