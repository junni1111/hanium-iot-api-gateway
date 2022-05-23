import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEVICE_MICROSERVICE } from '../../util/constants';
import { device_host, device_port } from '../../config/config';
import { TemperatureService } from './temperature.service';
import { WaterPumpService } from './water-pump.service';
import { LedService } from './led.service';
import { MasterService } from './master.service';
import { SlaveController } from './slave.controller';
import { MasterController } from './master.controller';
import { UtilityController } from './utility.controller';
import { SlaveService } from './slave.service';
import { SlaveLedController } from './slave-led.controller';
import { SlaveTemperatureController } from './slave-temperature.controller';
import { SlaveWaterPumpController } from './slave-water-pump.controller';

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
  controllers: [
    MasterController,
    SlaveController,
    UtilityController,
    SlaveLedController,
    SlaveTemperatureController,
    SlaveWaterPumpController,
  ],
  providers: [
    MasterService,
    SlaveService,
    TemperatureService,
    WaterPumpService,
    LedService,
  ],
})
export class DeviceModule {}
