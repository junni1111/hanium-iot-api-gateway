import { Module } from '@nestjs/common';
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
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
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
    UserService,
  ],
})
export class DeviceModule {}
