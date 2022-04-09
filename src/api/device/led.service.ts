import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic } from '../../util/api-topic';
import { LedConfigDto } from './dto/led-config.dto';
import { MasterService } from './master.service';

@Injectable()
export class LedService {
  constructor(private readonly deviceMicroservice: MasterService) {}

  async setLedConfig(ledConfigDto: LedConfigDto) {
    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.LED,
      ledConfigDto,
    );

    return lastValueFrom(this.deviceMicroservice.sendMessage(messageDto));
  }
}
