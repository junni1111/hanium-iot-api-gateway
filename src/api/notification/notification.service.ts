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
    const USER_AUTH_HOST = this.configService.get<string>(
      'USER_AUTH_HOST',
      '0.0.0.0',
    );
    const USER_AUTH_PORT = this.configService.get<number>(
      'NOTIFICATION_PORT_10000_TCP_PORT',
      10000,
    );
    return `http://${USER_AUTH_HOST}:${USER_AUTH_PORT}/${url}`;
  }

  ping() {
    return lastValueFrom(this.httpService.get(this.requestUrl('')));
  }
}
