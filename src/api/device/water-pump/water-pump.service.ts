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

  setWaterPumpConfig(waterPumpConfigDto: WaterPumpConfigDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('water-pump/config'),
        waterPumpConfigDto,
      ),
    ).then((res) => res.data);
  }

  turnWaterPump(waterPumpTurnDto: WaterPumpPowerDto) {
    console.log(`call turn water pump`, waterPumpTurnDto);

    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('water-pump/power'),
        waterPumpTurnDto,
      ),
    ).then((res) => res.data);
  }

  getWaterPumpState(waterPumpStateDto: WaterPumpStateDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('water-pump/state'),
        waterPumpStateDto,
      ),
    ).then((res) => res.data);
  }

  clearWaterPumpDB() {
    return lastValueFrom(
      this.httpService.delete(
        this.deviceMicroservice.requestUrl('water-pump/db'),
      ),
    ).then((res) => res.data);
  }
}
