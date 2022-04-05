import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEVICE_MICROSERVICE } from '../../util/constants';
import { device_host, device_port } from '../../config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: DEVICE_MICROSERVICE,
        transport: Transport.TCP,
        options: {
          host: device_host,
          port: device_port,
        },
      },
    ]),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
