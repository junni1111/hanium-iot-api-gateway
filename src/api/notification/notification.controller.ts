import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NOTIFICATION } from '../../util/constants/swagger';
import { NotificationService } from './notification.service';

@ApiTags(NOTIFICATION)
@Controller('api/notification-service')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
}
