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
    return {
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>('DEVICE_HOST'),
        port: this.configService.get<number>(
          'DEVICE_PORT_8888_TCP_PORT',
          this.configService.get<number>('DEVICE_PORT', 8888),
        ),
      },
    };
  }
}
