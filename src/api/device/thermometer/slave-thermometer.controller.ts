import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ESlaveConfigTopic } from 'src/util/api-topic';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';
import { TemperatureBetweenDto } from './dto/temperature-between.dto';
import { ResponseStatus } from '../interfaces/response-status';
import { MasterService } from '../master/master.service';
import { ThermometerService } from './thermometer.service';
import { THERMOMETER } from '../../../util/constants/swagger';
import { RolesGuard } from '../../user/guards/roles.guard';
import { UserRoles } from '../../user/enums/user-role';
import { AuthGuard } from '../../user/guards/auth.guard';

@ApiTags(THERMOMETER)
@ApiBearerAuth('access-token')
@Controller('api/device-service/thermometer')
export class SlaveTemperatureController {
  constructor(
    private readonly masterService: MasterService,
    private readonly thermometerService: ThermometerService,
  ) {}

  @Post('temperature/between')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(AuthGuard)
  async getTemperatures(
    @Headers() header: any,
    @Res() res: Response,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ) {
    try {
      const { data } = await this.thermometerService.getTemperatures(
        temperatureBetweenDto,
      );
      Logger.debug(`날짜 범위 온도: `, data);
      Logger.log(data);

      return res.status(data.status).json(data);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: 'temperature/between',
        message: e.message,
      };

      return res.status(response.status).json(response);
    }
  }

  @Get('temperature/now')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(AuthGuard)
  async getCurrentTemperature(
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ) {
    try {
      const { data } = await this.thermometerService.getCurrentTemperature(
        masterId,
        slaveId,
      );

      return res.status(data.status).json(data);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.THERMOMETER,
        message: e.message,
      };
      return res.status(response.status).json(response);
    }
  }

  /** Todo: 재한이한테 URL 수정 알려주기 */
  @Post('temperature/week')
  @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  @UseGuards(AuthGuard)
  async getTemperatureOneWeek(
    @Res() res: Response,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ) {
    const { data } = await this.thermometerService.getTemperatureOneWeek(
      temperatureBetweenDto,
    );
    console.log(data);
    return res.status(data.status).json(data);
  }

  @Post('config')
  @UseGuards(RolesGuard([UserRoles.ADMIN]))
  @UseGuards(AuthGuard)
  async setThermometerConfig(
    @Res() res: Response,
    @Body() thermometerConfigDto: ThermometerConfigDto,
  ) {
    try {
      const { data } = await this.thermometerService.setThermometerConfig(
        thermometerConfigDto,
      );

      return res.status(data.status).json(data);
    } catch (e) {
      const response: ResponseStatus = {
        status: HttpStatus.BAD_REQUEST,
        topic: ESlaveConfigTopic.THERMOMETER,
        message: e.message,
      };

      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }
  }

  @Post('test/temperature')
  async createTestTemperatureData(
    @Headers() header: any,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ) {
    const jwt = header['authorization']?.split(' ')[1];
    if (!jwt) {
      throw new NotFoundException('Jwt Not Found');
    }

    try {
      const { data } = await this.thermometerService.createTestData(
        temperatureBetweenDto,
      );
      // console.log(result);
      // console.log(result.data.length);

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  @Delete('db')
  async clearThermometerDB(@Res() res: Response, @Query('type') type: string) {
    try {
      const { data } = await this.thermometerService.clearThermometerDB(type);

      return res.send({
        statusCode: HttpStatus.OK,
        message: 'db clear completed',
        data,
      });
    } catch (e) {
      throw e;
    }
  }
}
