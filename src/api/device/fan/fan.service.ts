import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MasterService } from '../master/master.service';
import { HttpService } from '@nestjs/axios';
import { FanPowerDto } from './dto/fan-power.dto';

@Injectable()
export class FanService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  async turnFan(fanPowerDto: FanPowerDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('fan/power'),
        fanPowerDto,
      ),
    );
  }

  async clearFanDB() {
    return lastValueFrom(
      this.httpService.delete(this.deviceMicroservice.requestUrl('fan/db')),
    );
  }
}
