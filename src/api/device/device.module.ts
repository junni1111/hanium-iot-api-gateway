import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DEVICE_MICROSERVICE } from '../../util/constants';
import { DEVICE_HOST, DEVICE_PORT } from '../../config/config';
import { ThermometerService } from './thermometer.service';
import { WaterPumpService } from './water-pump.service';
import { LedService } from './led.service';
import { MasterService } from './master.service';
import { SlaveController } from './slave.controller';
import { MasterController } from './master.controller';
import { UtilityController } from './utility.controller';
import { SlaveService } from './slave.service';
import { SlaveLedController } from './slave-led.controller';
import { SlaveTemperatureController } from './slave-thermometer.controller';
import { SlaveWaterPumpController } from './slave-water-pump.controller';
import { SlaveFanController } from './slave-fan.controller';
import { FanService } from './fan.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: DEVICE_MICROSERVICE,
        transport: Transport.TCP,
        options: {
          host: DEVICE_HOST,
          port: DEVICE_PORT,
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
    SlaveFanController,
  ],
  providers: [
    MasterService,
    SlaveService,
    ThermometerService,
    WaterPumpService,
    LedService,
    FanService,
  ],
})
export class DeviceModule {}
