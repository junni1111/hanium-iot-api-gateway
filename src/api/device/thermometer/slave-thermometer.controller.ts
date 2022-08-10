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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';
import { TemperatureBetweenDto } from './dto/temperature-between.dto';
import { MasterService } from '../master/master.service';
import { ThermometerService } from './thermometer.service';
import { THERMOMETER } from '../../../util/constants/swagger';
import { ResponseGeneric } from '../../types/response-generic';
import { TemperatureGraphResponse } from './response/temperatuer-graph.response';

@ApiTags(THERMOMETER)
@ApiBearerAuth('access-token')
@Controller('api/device-service/thermometer')
export class SlaveTemperatureController {
  constructor(
    private readonly masterService: MasterService,
    private readonly thermometerService: ThermometerService,
  ) {}

  @ApiExtraModels(TemperatureGraphResponse)
  @ApiOkResponse({
    description: '특정 시간의 온도 API',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(TemperatureGraphResponse) },
    },
  })
  @Post('temperature/between')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async getTemperatures(
    @Headers() header: any,
    @Res() res: Response,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ): Promise<ResponseGeneric<TemperatureGraphResponse[]>> {
    try {
      const temperatureGraphResponse =
        await this.thermometerService.getTemperatures(temperatureBetweenDto);

      return res.status(HttpStatus.OK).send(temperatureGraphResponse);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: '현재 온도 API',
    type: TemperatureGraphResponse,
  })
  @Get('temperature/now')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async getCurrentTemperature(
    @Res() res: Response,
    @Query('master_id') masterId: number,
    @Query('slave_id') slaveId: number,
  ): Promise<ResponseGeneric<TemperatureGraphResponse>> {
    try {
      const temperatureGraphResponse =
        await this.thermometerService.getCurrentTemperature(masterId, slaveId);

      return res.status(HttpStatus.OK).json(temperatureGraphResponse);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiExtraModels(TemperatureGraphResponse)
  @ApiOkResponse({
    description: '일주일 간의 온도 API',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(TemperatureGraphResponse) },
    },
  })
  @Post('temperature/week')
  // @UseGuards(RolesGuard([UserRoles.ADMIN, UserRoles.USER]))
  // @UseGuards(AuthGuard)
  async getTemperatureOneWeek(
    @Res() res: Response,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ): Promise<ResponseGeneric<TemperatureGraphResponse[]>> {
    try {
      const temperatureGraphResponse =
        await this.thermometerService.getTemperatureOneWeek(
          temperatureBetweenDto,
        );

      return res.status(HttpStatus.OK).send(temperatureGraphResponse);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: '온도계 설정 API',
    schema: { type: 'string', example: 'ok' },
  })
  @Post('config')
  // @UseGuards(RolesGuard([UserRoles.ADMIN]))
  // @UseGuards(AuthGuard)
  async setThermometerConfig(
    @Res() res: Response,
    @Body() thermometerConfigDto: ThermometerConfigDto,
  ): Promise<ResponseGeneric<string>> {
    try {
      const thermometerConfig =
        await this.thermometerService.setThermometerConfig(
          thermometerConfigDto,
        );

      return res.status(HttpStatus.OK).send(thermometerConfig);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiExtraModels(TemperatureGraphResponse)
  @ApiOkResponse({
    description: '온도 생성 TEST API',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(TemperatureGraphResponse) },
    },
  })
  @Post('test/temperature')
  async createTestTemperatureData(
    @Headers() header: any,
    @Res() res: Response,
    @Body() temperatureBetweenDto: TemperatureBetweenDto,
  ): Promise<ResponseGeneric<TemperatureGraphResponse[]>> {
    try {
      const temperatureGraphResponse =
        await this.thermometerService.createTestData(temperatureBetweenDto);

      return res.status(HttpStatus.OK).send(temperatureGraphResponse);
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }

  @ApiOkResponse({
    description: '온도계 DB 삭제 API',
    schema: { type: 'string', example: '1' },
  })
  @Delete('db')
  async clearThermometerDB(
    @Res() res: Response,
    @Query('type') type: string,
  ): Promise<ResponseGeneric<any>> {
    try {
      const result = await this.thermometerService.clearThermometerDB(type);

      return res.status(HttpStatus.OK).send(result.affected.toString());
    } catch ({ response: { data: e } }) {
      console.log('error : ', e);
      return res.status(e.statusCode).send(e);
    }
  }
}
