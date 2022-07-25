import { Module } from '@nestjs/common';
import { ClientsDeviceConfigService } from './clients.device.service';

@Module({
  providers: [ClientsDeviceConfigService],
})
export class ClientsConfigModule {}
