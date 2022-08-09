import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UTILITY } from '../../util/constants/swagger';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseGeneric } from '../types/response-generic';

@ApiTags(UTILITY)
@Controller('api/user-service')
export class UtilityController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    description: 'AuthUser MS 상태 확인 API',
    schema: { type: 'string', example: 'auth-pong' },
  })
  @Get('ping')
  async pingToAuthMicroservice(@Res() res): Promise<ResponseGeneric<string>> {
    try {
      console.log(`call auth ping`);
      const result = await this.userService.ping();
      console.log(`Ping Auth Microservice Result: `, result);

      return res.status(HttpStatus.OK).send(result);
    } catch (e) {
      return res.status(e.statusCode).send(e.message);
    }
  }
}
