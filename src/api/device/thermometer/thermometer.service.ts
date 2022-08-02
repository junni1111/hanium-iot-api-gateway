import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MasterService } from '../master/master.service';
import { ThermometerConfigDto } from '../dto/thermometer/thermometer-config.dto';
import { TemperatureBetweenDto } from '../dto/thermometer/temperature-between.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ThermometerService {
  constructor(
    private readonly deviceMicroservice: MasterService,
    private readonly httpService: HttpService,
  ) {}

  async getTemperatures(temperatureBetweenDto: TemperatureBetweenDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/between'),
        temperatureBetweenDto,
      ),
    );
  }

  async getTemperatureOneWeek(temperatureBetweenDto: TemperatureBetweenDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/week'),
        temperatureBetweenDto,
      ),
    );
  }

  async getCurrentTemperature(masterId: number, slaveId: number) {
    return lastValueFrom(
      this.httpService.get(
        this.deviceMicroservice.requestUrl('temperature/now'),
        { params: { masterId, slaveId } },
      ),
    );
  }

  async createTestData(temperatureBetweenDto: TemperatureBetweenDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/test'),
        temperatureBetweenDto,
      ),
    );
  }

  async setThermometerConfig(thermometerConfigDto: ThermometerConfigDto) {
    return lastValueFrom(
      this.httpService.post(
        this.deviceMicroservice.requestUrl('temperature/config'),
        thermometerConfigDto,
      ),
    );
  }

  async clearThermometerDB(type: string) {
    return lastValueFrom(
      this.httpService.delete(
        this.deviceMicroservice.requestUrl('temperature/db'),
        { params: { type } },
      ),
    );
  }
}
