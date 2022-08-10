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
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MasterService } from '../master/master.service';
import { CreateSlaveDto } from './dto/create-slave.dto';
import { SlaveStateDto } from './dto/slave-state.dto';
import { SLAVE } from '../../../util/constants/swagger';
import { SlaveService } from './slave.service';
import { ResponseGeneric } from '../../types/response-generic';
import { Slave } from './entities/slave.entity';
import { SlaveStateResponse } from './response/slave-state.response';
import { SlaveConfigResponse } from './response/slave-config.response';

@ApiTags(SLAVE)
@ApiBearerAuth('access-token')
@Controller('api/device-service/slave')
export class SlaveController {
  constructor(
    private masterService: MasterService,
    private slaveService: SlaveService,
  ) {}

  @ApiCreatedResponse({ description: 'SLAVE 생성 API', type: Slave })
  @Post()
  // @UseGuards(RolesGuard([UserRoles.ADMIN]))
  // @UseGuards(AuthGuard)
  async createSlave(
    @Headers() header: any,
    @Res() res: Response,
    @Body() createSlaveDto: CreateSlaveDto,
  ): Promise<ResponseGeneric<Slave>> {
    try {
      const slave = await this.slaveService.createSlave(createSlaveDto);

      return res.status(HttpStatus.CREATED).send(slave);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: 'SLAVE 전원 상태 API',
    type: SlaveStateResponse,
  })
  @Get('state')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async getSensorsState(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ): Promise<ResponseGeneric<SlaveStateResponse>> {
    try {
      const slaveStateResponse = await this.slaveService.getSlaveState(
        new SlaveStateDto(masterId, slaveId),
      );
      return res.status(HttpStatus.OK).send(slaveStateResponse);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: 'SLAVE 설정 상태 API',
    type: SlaveConfigResponse,
  })
  @Get('config')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async fetchConfig(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ): Promise<ResponseGeneric<SlaveConfigResponse>> {
    try {
      const slaveConfigResponse = await this.slaveService.getSlaveConfigs(
        masterId,
        slaveId,
      );

      return res.status(HttpStatus.OK).send(slaveConfigResponse);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: 'SLAVE DB 삭제 API',
    schema: { type: 'string', example: '1' },
  })
  @Delete('db')
  async clearSlaveDB(@Res() res: Response): Promise<ResponseGeneric<string>> {
    try {
      const result = await this.slaveService.clearSlaveDB();

      return res.status(HttpStatus.OK).send(result.affected.toString());
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }
}
