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
import { Response } from 'express';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { CreateMasterDto } from './dto/master/create-master.dto';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { POLLING } from '../../util/api-topic';
import { MASTER } from '../../util/constants/swagger';

@ApiTags(MASTER)
@Controller('api/device-service/master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  async createMaster(
    @Headers() header: any,
    @Res() res: Response,
    @Body() createMasterDto: CreateMasterDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    try {
      const result = await this.masterService.createMaster(createMasterDto);

      return res.status(result.status).json(result);
    } catch (e) {
      console.log(e);
    }
  }

  // @Get('optimize/:master_id/:slave_id')
  // async optimizeConfig(
  //   @Res() res: Response,
  //   @Param('master_id') masterId: number,
  //   @Param('slave_id') slaveId: number,
  // ) {
  //   try {
  //     const message = { master_id: masterId, slave_id: slaveId };
  //     const dto = new DeviceMessageDto('optimize', JSON.stringify(message));
  //     const result = await lastValueFrom(this.masterService.sendMessage(dto));
  //
  //     return res.status(HttpStatus.OK).json(result);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  /* TODO: Make Polling DTO*/
  @Get('state')
  async getMasterState(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
  ) {
    try {
      const dto = new DeviceMessageDto(POLLING, masterId.toString());
      const result = await lastValueFrom(this.masterService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      return e;
    }
  }
}
