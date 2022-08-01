import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModuleOptionsFactory,
} from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class ClientsDeviceConfigService implements ClientsModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createClientOptions(): ClientProvider {
    const DEVICE_HOST = this.configService.get<string>('DEVICE_HOST');
    const DEVICE_PORT =
      this.configService.get<number>('DEVICE_PORT_8888_TCP_PORT') ||
      this.configService.get<number>('DEVICE_PORT', 8888);
    return {
      transport: Transport.TCP,
      options: {
        host: DEVICE_HOST,
        port: DEVICE_PORT,
      },
    };
  }
}
