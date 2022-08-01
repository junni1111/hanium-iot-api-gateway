import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  requestUrl(url: string) {
    const USER_HOST = this.configService.get<string>('USER_AUTH_HOST');
    const USER_PORT = this.configService.get<number>('AUTH_PORT_9000_TCP_PORT');
    return `http://${USER_HOST}:${USER_PORT}/${url}`;
  }

  ping() {
    return lastValueFrom(this.httpService.get(this.requestUrl('')));
  }

  signUp(createUserDto: CreateUserDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('signup'), createUserDto),
    );
  }

  jwt(jwt: string) {
    return lastValueFrom(
      this.httpService.get(this.requestUrl('jwt'), { params: { jwt } }),
    );
  }

  refresh(tokens: any) {
    return lastValueFrom(
      this.httpService.get(this.requestUrl('refresh'), {
        params: {
          userId: tokens.userId,
          refresh: tokens.refreshToken,
        },
      }),
    );
  }

  /** Todo: Replace to JWT */
  signIn(signInDto: SignInDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('signin'), {
        email: signInDto.email,
        password: signInDto.password,
      }),
    );
  }

  signOut(userId: number) {
    return lastValueFrom(
      this.httpService.get(this.requestUrl('signout'), {
        params: {
          userId,
        },
      }),
    );
  }
}
