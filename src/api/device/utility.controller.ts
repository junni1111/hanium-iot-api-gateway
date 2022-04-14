import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UTILITY } from '../../util/constants';
import { MasterService } from './master.service';
import { DeviceMessageDto } from './dto/device-message.dto';
import { lastValueFrom } from 'rxjs';

@ApiTags(UTILITY)
@Controller('api/device')
export class UtilityController {
  constructor(private readonly masterService: MasterService) {}

  @Get('ping')
  async pingToDeviceMicroservice(@Res() res) {
    console.log(`call ping`);
    const result = await lastValueFrom(
      this.masterService.sendMessage(new DeviceMessageDto('ping', 'pong')),
    );

    console.log(`Ping Device Microservice Result: `, result);
    return res.send(result);
  }
}
