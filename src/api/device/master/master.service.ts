import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeviceMessageDto } from '../dto/device-message.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { ResponseStatus } from '../interfaces/response-status';
import { CreateMasterDto } from '../dto/master/create-master.dto';
import { CreateSlaveDto } from '../dto/slave/create-slave.dto';
import { DEVICE_MICROSERVICE } from '../../../util/constants/microservices';

@Injectable()
export class MasterService {
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
    console.log(dto);
    return this.deviceMicroservice.send(dto.messagePattern, dto.payload).pipe(
      map((data: ResponseStatus) => {
        console.log(data);
        return data;
      }),
      catchError((e) => {
        throw new NotFoundException(e);
      }),
    );
  }
}
