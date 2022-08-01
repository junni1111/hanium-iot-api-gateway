import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DeviceMessageDto } from '../dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveState } from '../../../util/api-topic';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MasterService } from '../master/master.service';
import { CreateSlaveDto } from '../dto/slave/create-slave.dto';
import { SlaveStateDto } from '../dto/slave/slave-state.dto';
import { SLAVE } from '../../../util/constants/swagger';
import { ResponseStatus } from '../interfaces/response-status';
import { SlaveService } from './slave.service';

@ApiTags(SLAVE)
@ApiBearerAuth('access-token')
@Controller('api/device-service/slave')
export class SlaveController {
  constructor(
    private masterService: MasterService,
    private slaveService: SlaveService,
  ) {}

  /* Todo: Refactor URL path */

  @Post()
  async createSlave(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

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
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    const message = new DeviceMessageDto(
      ESlaveState.ALL,
      new SlaveStateDto(masterId, slaveId),
    );
    const result = await lastValueFrom(this.masterService.sendMessage(message));

    return res.status(HttpStatus.OK).json(result);
  }

  @Get('config')
  async fetchConfig(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

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
