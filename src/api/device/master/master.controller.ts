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
import { CreateMasterDto } from './dto/create-master.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MasterService } from './master.service';
import { MASTER } from '../../../util/constants/swagger';
import { ResponseGeneric } from '../../types/response-generic';
import { Master } from './entities/master.entity';

@ApiTags(MASTER)
@ApiBearerAuth('access-token')
@Controller('api/device-service/master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @ApiCreatedResponse({ description: 'MASTER 생성 API', type: Master })
  @Post()
  // @UseGuards(RolesGuard([UserRoles.ADMIN]))
  // @UseGuards(AuthGuard)
  async createMaster(
    @Res() res: Response,
    @Body() createMasterDto: CreateMasterDto,
  ): Promise<ResponseGeneric<Master>> {
    const user = createMasterDto?.user;
    console.log(`DTO User: `, user);

    try {
      const master = await this.masterService.createMaster(createMasterDto);

      return res.status(HttpStatus.CREATED).send(master);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  /* TODO: Make Polling DTO*/
  @ApiOkResponse({
    description: 'MASTER POLLING API',
    schema: { type: 'string', example: 'on' },
  })
  @Get('state')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async getMasterState(
    @Headers() header: any,
    @Res() res: Response,
    @Query('master_id') masterId: number,
  ): Promise<ResponseGeneric<string>> {
    try {
      console.log(`Call Polling `, masterId);
      const pollingResult = await this.masterService.getMasterState(masterId);

      return res.status(HttpStatus.OK).send(pollingResult);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }

  @ApiOkResponse({
    description: 'MASTER DB 삭제 API',
    schema: { type: 'string', example: '1' },
  })
  @Delete('db')
  async clearMasterDB(@Res() res: Response): Promise<ResponseGeneric<string>> {
    try {
      const result = await this.masterService.clearMasterDB();

      return res.status(HttpStatus.OK).send(result.affected.toString());
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }
}
