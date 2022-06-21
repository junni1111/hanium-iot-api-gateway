import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MasterService } from './master.service';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom, map } from 'rxjs';
import { UTILITY } from '../../util/constants/swagger';
import { UserService } from '../user/user.service';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags(UTILITY)
@Controller('api/device-service')
export class UtilityController {
  constructor(private readonly masterService: MasterService) {}

  @Get('ping')
  async pingToDeviceMicroservice(@Res() res) {
    console.log(`call device ping`);
    const result = await lastValueFrom(
      this.masterService.sendMessage(new DeviceMessageDto('ping', 'pong')),
    );

    console.log(`Ping Device Microservice Result: `, result);
    return res.send(result);
  }
}
