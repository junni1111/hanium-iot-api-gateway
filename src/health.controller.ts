import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UTILITY } from './util/constants/swagger';

@ApiTags(UTILITY)
@Controller()
export class HealthController {
  @ApiOkResponse({
    description: 'API GATEWAY 상태 확인 API',
    schema: { type: 'string', example: 'ok' },
  })
  @Get()
  healthCheck(@Res() res) {
    console.log(`Health check`);

    return res.status(HttpStatus.OK).send('ok');
  }
}
