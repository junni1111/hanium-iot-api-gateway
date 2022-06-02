import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveTurnPowerTopic } from '../../util/api-topic';
import { MasterService } from './master.service';
import { SlavePowerDto } from './dto/slave/slave-power.dto';

@Injectable()
export class FanService {
  constructor(private readonly deviceMicroservice: MasterService) {}

  async turnFan(fanPowerDto: SlavePowerDto) {
    const turnFanMessageDto = new DeviceMessageDto(
      ESlaveTurnPowerTopic.FAN,
      fanPowerDto,
    );

    return lastValueFrom(
      this.deviceMicroservice.sendMessage(turnFanMessageDto),
    );
  }
}
