import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic } from '../../util/api-topic';
import { MasterService } from './master.service';
import { TemperatureConfigDto } from './dto/temperature-config.dto';
import { ResponseStatus } from './interfaces/response-status';

@Injectable()
export class TemperatureService {
  constructor(private readonly deviceMicroservice: MasterService) {}

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
