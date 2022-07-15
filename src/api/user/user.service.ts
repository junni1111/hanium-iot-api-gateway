import { Inject, Injectable } from '@nestjs/common';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HttpService } from '@nestjs/axios';
import { requestUrl } from '../../config/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_AUTH_MICROSERVICE) private userAuthClient: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  ping() {
    return this.userAuthClient.send('ping', 'pong').pipe((data) => data);
  }

  signUp(createUserDto: CreateUserDto) {
    return lastValueFrom(
      this.httpService.post(`${requestUrl}/signup`, createUserDto),
    );
  }

  jwt(jwt: string) {
    return lastValueFrom(
      this.httpService.get(`${requestUrl}/jwt`, { params: { jwt } }),
    );
  }

  refresh(tokens: any) {
    return lastValueFrom(
      this.httpService.get(`${requestUrl}/refresh`, {
        params: {
          access: tokens.accessToken,
          refresh: tokens.refreshToken,
        },
      }),
    );
  }

  /** Todo: Replace to JWT */
  signIn(signInDto: SignInDto) {
    return lastValueFrom(
      this.httpService.post(`${requestUrl}/signin`, {
        email: signInDto.email,
        password: signInDto.password,
      }),
    );
  }
}
