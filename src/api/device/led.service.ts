import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import {
  ESlaveConfigTopic,
  ESlaveState,
  ESlaveTurnPowerTopic,
} from '../../util/api-topic';
import { LedConfigDto } from './dto/led/led-config.dto';
import { MasterService } from './master.service';
import { LedTurnDto } from './dto/led/led-turn.dto';
import { LedStateDto } from './dto/led/led-state.dto';

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

  async turnLed(ledTurnDto: LedTurnDto) {
    console.log(`call turn led`, ledTurnDto);
    const turnLedMessageDto = new DeviceMessageDto(
      ESlaveTurnPowerTopic.LED,
      ledTurnDto,
    );

    return lastValueFrom(
      this.deviceMicroservice.sendMessage(turnLedMessageDto),
    );
  }

  async getLedState(ledStateDto: LedStateDto) {
    console.log(`call led state service`);
    const ledStateMessageDto = new DeviceMessageDto(
      ESlaveState.LED,
      ledStateDto,
    );

    return lastValueFrom(
      this.deviceMicroservice.sendMessage(ledStateMessageDto),
    );
  }
}
