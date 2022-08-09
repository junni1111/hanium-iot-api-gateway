import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MasterService } from '../master/master.service';
import { ThermometerConfigDto } from './dto/thermometer-config.dto';
import { TemperatureBetweenDto } from './dto/temperature-between.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ThermometerService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  getTemperatures(temperatureBetweenDto: TemperatureBetweenDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/between'),
        temperatureBetweenDto,
      ),
    ).then((res) => res.data);
  }

  getTemperatureOneWeek(temperatureBetweenDto: TemperatureBetweenDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/week'),
        temperatureBetweenDto,
      ),
    ).then((res) => res.data);
  }

  getCurrentTemperature(masterId: number, slaveId: number) {
    return lastValueFrom(
      this.httpService.get(
        this.deviceMicroservice.requestUrl('temperature/now'),
        { params: { masterId, slaveId } },
      ),
    ).then((res) => res.data);
  }

  createTestData(temperatureBetweenDto: TemperatureBetweenDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/test'),
        temperatureBetweenDto,
      ),
    ).then((res) => res.data);
  }

  setThermometerConfig(thermometerConfigDto: ThermometerConfigDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/config'),
        thermometerConfigDto,
      ),
    ).then((res) => res.data);
  }

  clearThermometerDB(type: string) {
    return lastValueFrom(
      this.httpService.delete(
        this.deviceMicroservice.requestUrl('temperature/db'),
        { params: { type } },
      ),
    ).then((res) => res.data);
  }
}
