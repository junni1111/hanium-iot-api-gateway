import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UTILITY } from './util/constants';

@ApiTags(UTILITY)
@Controller()
export class HealthController {
  @Get()
  healthCheck(@Res() res) {
    console.log(`call health check`);

    return res.status(HttpStatus.OK).send('ok');
  }
}
