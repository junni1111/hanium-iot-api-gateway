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
import { CreateMasterDto } from './dto/create-master.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { MASTER } from '../../../util/constants/swagger';
import { AuthGuard } from 'src/api/user/guards/auth.guard';
import { RolesGuard } from '../../user/guards/roles.guard';
import { UserRoles } from '../../user/enums/user-role';

@ApiTags(MASTER)
@ApiBearerAuth('access-token')
@Controller('api/device-service/master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post()
  @UseGuards(RolesGuard([UserRoles.ADMIN]))
  @UseGuards(AuthGuard)
  async createMaster(
    @Res() res: Response,
    @Body() createMasterDto: CreateMasterDto,
  ) {
    // Todo : jwt 유효성 확인 및 사용자 정보 확인
    const user = createMasterDto?.user;
    console.log(`DTO User: `, user);

    try {
      const { data } = await this.masterService.createMaster(createMasterDto);

      return res.status(data.status).json(data);
      // return res.json(user);
    } catch (e) {
      console.log(e);
    }
  }

  /* TODO: Make Polling DTO*/
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
      const { data } = await this.masterService.getMasterState(masterId);

      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return e;
    }
  }
}
