import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MasterService } from './master/master.service';
import { UTILITY } from '../../util/constants/swagger';
import { HttpService } from '@nestjs/axios';
import { ResponseGeneric } from '../types/response-generic';

@ApiTags(UTILITY)
@Controller('api/device-service')
export class UtilityController {
  constructor(
    private readonly masterService: MasterService,
    private readonly httpService: HttpService,
  ) {}

  @ApiOkResponse({
    description: 'Device MS 상태 확인 API',
    schema: { type: 'string', example: 'device-pong' },
  })
  @Get('ping')
  async pingToDeviceMicroservice(@Res() res): Promise<ResponseGeneric<string>> {
    try {
      console.log(`call device ping`);

      const result = await this.masterService.ping();
      console.log(`Ping Device Microservice Result: `, result);

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }
}
