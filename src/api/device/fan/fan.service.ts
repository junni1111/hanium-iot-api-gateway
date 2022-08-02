import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MasterService } from '../master/master.service';
import { SlavePowerDto } from '../dto/slave/slave-power.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FanService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  async turnFan(fanPowerDto: SlavePowerDto) {
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
