import { MasterService } from './master.service';
import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic } from '../../util/api-topic';
import { SlaveConfigDto } from './dto/slave/slave-config.dto';

@Injectable()
export class SlaveService {
  constructor(private readonly deviceMicroservice: MasterService) {}

  async getSlaveConfigs(masterId: number, slaveId: number) {
    const slaveConfigDto = new SlaveConfigDto();
    slaveConfigDto.masterId = masterId;
    slaveConfigDto.slaveId = slaveId;

    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.ALL,
      slaveConfigDto,
    );

    return lastValueFrom(this.deviceMicroservice.sendMessage(messageDto));
  }
}
