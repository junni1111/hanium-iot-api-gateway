import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEVICE_MICROSERVICE } from '../../util/constants';
import { device_host, device_port } from '../../config';
import { TemperatureService } from './temperature.service';
import { WaterPumpService } from './water-pump.service';
import { LedService } from './led.service';
import { MasterService } from './master.service';
import { SlaveController } from './slave.controller';
import { MasterController } from './master.controller';

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
  controllers: [MasterController, SlaveController],
  providers: [MasterService, TemperatureService, WaterPumpService, LedService],
})
export class DeviceModule {}
