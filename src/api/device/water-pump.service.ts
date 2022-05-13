import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic, ESlaveTurnPowerTopic } from '../../util/api-topic';
import { MasterService } from './master.service';
import { WaterPumpConfigDto } from './dto/water-pump/water-pump-config.dto';
import { ResponseStatus } from './interfaces/response-status';
import { WaterPumpTurnDto } from './dto/water-pump/water-pump-turn.dto';

@Injectable()
export class WaterPumpService {
  constructor(private readonly deviceMicroservice: MasterService) {}

  async setWaterPumpConfig(
    waterPumpConfigDto: WaterPumpConfigDto,
  ): Promise<ResponseStatus> {
    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.WATER_PUMP,
      waterPumpConfigDto,
    );

    return lastValueFrom(this.deviceMicroservice.sendMessage(messageDto));
  }

  async turnWaterPump(waterPumpTurnDto: WaterPumpTurnDto) {
    console.log(`call turn led`, waterPumpTurnDto);
    const turnWaterPumpMessageDto = new DeviceMessageDto(
      ESlaveTurnPowerTopic.WATER_PUMP,
      waterPumpTurnDto,
    );

    return lastValueFrom(
      this.deviceMicroservice.sendMessage(turnWaterPumpMessageDto),
    );
  }
}
