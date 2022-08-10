import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  requestUrl(url: string) {
    const NOTIFICATION_HOST = this.configService.get<string>(
      'NOTIFICATION_HOST',
      '0.0.0.0',
    );
    const NOTIFICATION_PORT = this.configService.get<number>(
      'NOTIFICATION_PORT_10000_TCP_PORT',
      10000,
    );
    console.log('notification : ', NOTIFICATION_HOST, NOTIFICATION_PORT);
    return `http://${NOTIFICATION_HOST}:${NOTIFICATION_PORT}/${url}`;
  }

  ping() {
    return lastValueFrom(this.httpService.get(this.requestUrl('ping'))).then(
      (res) => res.data,
    );
  }
}
