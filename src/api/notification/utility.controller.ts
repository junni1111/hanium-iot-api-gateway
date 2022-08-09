import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UTILITY } from '../../util/constants/swagger';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ResponseGeneric } from '../types/response-generic';

@ApiTags(UTILITY)
@Controller('api/notification-service')
export class UtilityController {
  constructor(private notificationService: NotificationService) {}

  @ApiOkResponse({
    description: 'AuthUser MS 상태 확인 API',
    schema: { type: 'string', example: 'notification-pong' },
  })
  @Get('ping')
  async pingToNotificationMicroservice(
    @Res() res,
  ): Promise<ResponseGeneric<string>> {
    try {
      console.log(`call notification ping`);

      const result = await this.notificationService.ping();
      console.log(`Ping Notification Microservice Result: `, result);

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }
}
