import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CreateMasterDto } from './dto/create-master.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MasterService {
  constructor(
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

  ping() {
    return lastValueFrom(this.httpService.get(this.requestUrl('ping'))).then(
      (res) => res.data,
    );
  }

  createMaster(createMasterDto: CreateMasterDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('master'), createMasterDto),
    ).then((res) => res.data);
  }

  getMasterState(masterId: number) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('master/polling'), {
        params: {
          masterId,
        },
      }),
    ).then((res) => res.data);
  }

  clearMasterDB() {
    return lastValueFrom(
      this.httpService.delete(this.requestUrl('master/db')),
    ).then((res) => res.data);
  }
}
