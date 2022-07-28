import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
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
import { DEVICE_MICROSERVICE } from '../../util/constants/microservices';
import { ClientsDeviceConfigService } from '../../config/clients/clients.device.service';
import { ClientsConfigModule } from '../../config/clients/clients.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: DEVICE_MICROSERVICE,
        imports: [ClientsConfigModule],
        useClass: ClientsDeviceConfigService,
        inject: [ClientsDeviceConfigService],
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
