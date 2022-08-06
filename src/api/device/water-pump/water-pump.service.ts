import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MasterService } from '../master/master.service';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { WaterPumpPowerDto } from './dto/water-pump-power.dto';
import { WaterPumpStateDto } from './dto/water-pump-state.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WaterPumpService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  async setWaterPumpConfig(waterPumpConfigDto: WaterPumpConfigDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('water-pump/config'),
        waterPumpConfigDto,
      ),
    );
  }

  async turnWaterPump(waterPumpTurnDto: WaterPumpPowerDto) {
    console.log(`call turn water pump`, waterPumpTurnDto);

    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('water-pump/power'),
        waterPumpTurnDto,
      ),
    );
  }

  async getWaterPumpState(waterPumpStateDto: WaterPumpStateDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('water-pump/state'),
        waterPumpStateDto,
      ),
    );
  }

  async clearWaterPumpDB() {
    return lastValueFrom(
      this.httpService.delete(
        this.deviceMicroservice.requestUrl('water-pump/db'),
      ),
    );
  }
}
