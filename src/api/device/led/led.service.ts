import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { LedConfigDto } from './dto/led-config.dto';
import { MasterService } from '../master/master.service';
import { LedPowerDto } from './dto/led-power.dto';
import { LedStateDto } from './dto/led-state.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LedService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  setLedConfig(ledConfigDto: LedConfigDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('led/config'),
        ledConfigDto,
      ),
    ).then((res) => res.data);
  }

  getLedState(ledStateDto: LedStateDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('led/state'),
        ledStateDto,
      ),
    ).then((res) => res.data);
  }

  turnLed(ledPowerDto: LedPowerDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('led/power'),
        ledPowerDto,
      ),
    ).then((res) => res.data);
  }

  clearLedDB() {
    return lastValueFrom(
      this.httpService.delete(this.deviceMicroservice.requestUrl('led/db')),
    ).then((res) => res.data);
  }
}
