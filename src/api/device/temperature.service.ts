import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic } from '../../util/api-topic';
import { MasterService } from './master.service';
import { TemperatureConfigDto } from './dto/temperature/temperature-config.dto';
import { ResponseStatus } from './interfaces/response-status';

@Injectable()
export class TemperatureService {
  constructor(private readonly deviceMicroservice: MasterService) {}

  async getCurrentTemperature(
    masterId: number,
    slaveId: number,
  ): Promise<ResponseStatus> {
    return lastValueFrom(
      this.deviceMicroservice.sendMessage(
        new DeviceMessageDto(
          /* Todo: Change topic */
          'temperature/now',
          JSON.stringify({ master_id: masterId, slave_id: slaveId }),
        ),
      ),
    );
  }

  async createTestData() {
    return lastValueFrom(
      this.deviceMicroservice.sendMessage(
        new DeviceMessageDto('test/temperature', ''),
      ),
    );
  }

  async setTemperatureConfig(
    temperatureConfigDto: TemperatureConfigDto,
  ): Promise<ResponseStatus> {
    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.TEMPERATURE,
      temperatureConfigDto,
    );

    return lastValueFrom(this.deviceMicroservice.sendMessage(messageDto));
  }
}
