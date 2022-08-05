import { ApiTags } from '@nestjs/swagger';
import { UTILITY } from '../../util/constants/swagger';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

@ApiTags(UTILITY)
@Controller('api/notification-service')
export class UtilityController {
  constructor(private notificationService: NotificationService) {}

  @Get('ping')
  async pingToAuthMicroservice(@Res() res) {
    try {
      console.log(`call auth ping`);

      const { data } = await this.notificationService.ping();

      console.log(`Ping Notification Microservice Result: `, data);
      return res.send({
        statusCode: HttpStatus.OK,
        message: data,
      });
    } catch (e) {
      throw new HttpException(
        {
          statusCode: e.response.data.statusCode,
          message: e.response.data.message,
        },
        e.response.data.statusCode,
      );
    }
  }
}
