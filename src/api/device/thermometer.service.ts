import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic } from '../../util/api-topic';
import { MasterService } from './master.service';
import { ThermometerConfigDto } from './dto/thermometer/thermometer-config.dto';
import { ResponseStatus } from './interfaces/response-status';
import { SlaveStateDto } from './dto/slave/slave-state.dto';

@Injectable()
export class ThermometerService {
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

  async createTestData(dto: SlaveStateDto) {
    return lastValueFrom(
      this.deviceMicroservice.sendMessage(
        new DeviceMessageDto('test/temperature', dto),
      ),
    );
  }

  async setThermometerConfig(
    ThermometerConfigDto: ThermometerConfigDto,
  ): Promise<ResponseStatus> {
    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.THERMOMETER,
      ThermometerConfigDto,
    );

    return lastValueFrom(this.deviceMicroservice.sendMessage(messageDto));
  }
}
