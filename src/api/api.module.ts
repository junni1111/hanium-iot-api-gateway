import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DeviceModule, UserModule],
})
export class ApiModule {}
