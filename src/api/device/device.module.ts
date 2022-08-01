import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ThermometerService } from './thermometer/thermometer.service';
import { WaterPumpService } from './water-pump/water-pump.service';
import { LedService } from './led/led.service';
import { MasterService } from './master/master.service';
import { SlaveController } from './slave/slave.controller';
import { MasterController } from './master/master.controller';
import { UtilityController } from './utility.controller';
import { SlaveService } from './slave/slave.service';
import { SlaveLedController } from './led/slave-led.controller';
import { SlaveTemperatureController } from './thermometer/slave-thermometer.controller';
import { SlaveWaterPumpController } from './water-pump/slave-water-pump.controller';
import { SlaveFanController } from './fan/slave-fan.controller';
import { FanService } from './fan/fan.service';
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
