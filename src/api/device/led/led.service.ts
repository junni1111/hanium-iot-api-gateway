import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { LedConfigDto } from '../dto/led/led-config.dto';
import { MasterService } from '../master/master.service';
import { LedPowerDto } from '../dto/led/led-power.dto';
import { LedStateDto } from '../dto/led/led-state.dto';
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
    );
  }

  async getLedState(ledStateDto: LedStateDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('led/state'),
        ledStateDto,
      ),
    );
  }

  async turnLed(ledPowerDto: LedPowerDto) {
    console.log(`call turn led`, ledPowerDto);
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('led/power'),
        ledPowerDto,
      ),
    );
  }

  async clearLedDB() {
    return lastValueFrom(
      this.httpService.delete(this.deviceMicroservice.requestUrl('led/db')),
    );
  }
}
