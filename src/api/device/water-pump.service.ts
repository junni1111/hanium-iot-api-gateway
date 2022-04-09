import { Injectable } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';
import { ESlaveConfigTopic } from '../../util/api-topic';
import { MasterService } from './master.service';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { ResponseStatus } from './interfaces/response-status';

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
}
