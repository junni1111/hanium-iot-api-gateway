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

  async clearMasterDB() {
    return lastValueFrom(this.httpService.delete(this.requestUrl('master/db')));
  }
}
