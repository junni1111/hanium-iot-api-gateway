import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master/master.service';
import { lastValueFrom } from 'rxjs';
import { UTILITY } from '../../util/constants/swagger';
import { HttpService } from '@nestjs/axios';

@ApiTags(UTILITY)
@Controller('api/device-service')
export class UtilityController {
  constructor(
    private readonly masterService: MasterService,
    private readonly httpService: HttpService,
  ) {}

  @Get('ping')
  async pingToDeviceMicroservice(@Res() res) {
    console.log(`call device ping`);
    const { data } = await lastValueFrom(
      this.httpService.get(this.masterService.requestUrl('ping')),
    );

    console.log(`Ping Device Microservice Result: `, data);
    return res.send(data);
  }
}
