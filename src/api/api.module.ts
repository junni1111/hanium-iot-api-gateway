import { Module } from '@nestjs/common';
import { DeviceModule } from './device/device.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [DeviceModule, UserModule, NotificationModule],
})
export class ApiModule {}
