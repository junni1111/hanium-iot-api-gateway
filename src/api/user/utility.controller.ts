import { ApiTags } from '@nestjs/swagger';
import { UTILITY } from '../../util/constants/swagger';
import { Controller, Get, Inject, Res } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags(UTILITY)
@Controller('api/user-service')
export class UtilityController {
  constructor(
    private userService: UserService,
    @Inject(USER_AUTH_MICROSERVICE) private userAuthClient: ClientProxy,
  ) {}

  @Get('ping')
  async pingToAuthMicroservice(@Res() res) {
    console.log(`call auth ping`);

    const result = await lastValueFrom(
      this.userAuthClient.send('ping', 'pong').pipe((data) => data),
    );

    console.log(`Ping Auth Microservice Result: `, result);
    return res.send(result);
  }
}
