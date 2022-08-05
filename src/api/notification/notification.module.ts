import { Module } from '@nestjs/common';
import { UtilityController } from './utility.controller';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  controllers: [NotificationController, UtilityController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
