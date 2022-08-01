import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeviceMessageDto } from '../dto/device-message.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { ResponseStatus } from '../interfaces/response-status';
import { CreateMasterDto } from '../dto/master/create-master.dto';
import { DEVICE_MICROSERVICE } from '../../../util/constants/microservices';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MasterService {
  constructor(
    @Inject(DEVICE_MICROSERVICE)
    private readonly deviceMicroservice: ClientProxy,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  requestUrl(url: string) {
    const USER_HOST = this.configService.get<string>('DEVICE_HOST');
    const USER_PORT = this.configService.get<number>(
      'DEVICE_PORT_8000_TCP_PORT',
    );
    return `http://${USER_HOST}:${USER_PORT}/${url}`;
  }

  async createMaster(createMasterDto: CreateMasterDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('master'), createMasterDto),
    );
  }

  async getMasterState(masterId: number) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('master/polling'), {
        params: {
          masterId,
        },
      }),
    );
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
