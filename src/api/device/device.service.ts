import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeviceMessageDto } from './dto/device-message.dto';
import { ClientProxy } from '@nestjs/microservices';
import { DEVICE_MICROSERVICE } from '../../util/constants';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { ResponseStatus } from './interfaces/response-status';
import { ESlaveConfigTopic } from '../../util/api-topic';
import { TemperatureConfigDto } from './dto/temperature-config.dto';
import { LedConfigDto } from './dto/led-config.dto';
import { WaterPumpConfigDto } from './dto/water-pump-config.dto';
import { CreateMasterDto } from './dto/create-master.dto';
import { CreateSlaveDto } from './dto/create-slave.dto';

@Injectable()
export class DeviceService {
  constructor(
    @Inject(DEVICE_MICROSERVICE)
    private readonly deviceMicroservice: ClientProxy,
  ) {}

  async createMaster(
    createMasterDto: CreateMasterDto,
  ): Promise<ResponseStatus> {
    const payload = new DeviceMessageDto('create/master', createMasterDto);
    const result = lastValueFrom(this.sendMessage(payload));

    return result;
  }

  async createSlave(createSlaveDto: CreateSlaveDto): Promise<ResponseStatus> {
    const payload = new DeviceMessageDto('create/slave', createSlaveDto);
    return lastValueFrom(this.sendMessage(payload));
  }

  sendMessage(dto: DeviceMessageDto): Observable<ResponseStatus> {
    return this.deviceMicroservice.send(dto.messagePattern, dto.payload).pipe(
      map((data: ResponseStatus) => {
        return data;
      }),
      catchError((e) => {
        throw new NotFoundException(e);
      }),
    );
  }

  async setWaterPumpConfig(
    waterPumpConfigDto: WaterPumpConfigDto,
  ): Promise<ResponseStatus> {
    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.WATER_PUMP,
      waterPumpConfigDto,
    );

    return lastValueFrom(this.sendMessage(messageDto));
  }

  async setTemperatureConfig(
    temperatureConfigDto: TemperatureConfigDto,
  ): Promise<ResponseStatus> {
    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.TEMPERATURE,
      temperatureConfigDto,
    );

    return lastValueFrom(this.sendMessage(messageDto));
  }

  async setLedConfig(ledConfigDto: LedConfigDto) {
    const messageDto = new DeviceMessageDto(
      ESlaveConfigTopic.LED,
      ledConfigDto,
    );

    return lastValueFrom(this.sendMessage(messageDto));
  }
}
