import { ApiTags } from '@nestjs/swagger';
import { UTILITY } from '../../util/constants/swagger';
import { Controller, Get, Res } from '@nestjs/common';
import { UserService } from './user.service';

@ApiTags(UTILITY)
@Controller('api/user-service')
export class UtilityController {
  constructor(private userService: UserService) {}

  @Get('ping')
  async pingToAuthMicroservice(@Res() res) {
    console.log(`call auth ping`);

    const result = await this.userService.ping();

    console.log(`Ping Auth Microservice Result: `, result);
    return res.send(result);
  }
}
