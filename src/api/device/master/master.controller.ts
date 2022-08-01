import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { DeviceMessageDto } from '../dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { CreateMasterDto } from '../dto/master/create-master.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { POLLING } from '../../../util/api-topic';
import { MASTER } from '../../../util/constants/swagger';
import { AuthGuard } from '../guards/auth.guard';
import {RolesGuard} from "../guards/roles.guard";

@ApiTags(MASTER)
@ApiBearerAuth('access-token')
@Controller('api/device-service/master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  async createMaster(
    // @Headers() header: any,
    @Res() res: Response,
    @Body() createMasterDto: CreateMasterDto,
  ) {
    // const jwt = header['authorization']?.split(' ')[1];
    // if (!jwt) {
    //   throw new NotFoundException('Jwt Not Found');
    // }
    // Todo : jwt 유효성 확인 및 사용자 정보 확인

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

  /* TODO: Make Polling DTO */
  @Get('state')
  async getMasterState(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      const dto = new DeviceMessageDto(POLLING, masterId.toString());
      const result = await lastValueFrom(this.masterService.sendMessage(dto));

      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      return e;
    }
  }
}
