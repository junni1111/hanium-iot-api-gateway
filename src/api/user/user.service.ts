import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from './dto/auth-user.dto';
import { AxiosResponse } from 'axios';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  requestUrl(url: string) {
    const USER_AUTH_HOST = this.configService.get<string>(
      'USER_AUTH_HOST',
      '0.0.0.0',
    );
    const USER_AUTH_PORT = this.configService.get<number>(
      'AUTH_PORT_9000_TCP_PORT',
      9000,
    );
    return `http://${USER_AUTH_HOST}:${USER_AUTH_PORT}/${url}`;
  }

  ping() {
    return lastValueFrom(this.httpService.get(this.requestUrl('')));
  }

  signUp(createUserDto: CreateUserDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('signup'), createUserDto),
    );
  }

  async jwt(jwt: string): Promise<any> {
    const { data: user } = await lastValueFrom(
      this.httpService.get(this.requestUrl('jwt'), { params: { jwt } }),
    );

    return user;
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

  clearUserDB() {
    return lastValueFrom(this.httpService.delete(this.requestUrl('db/clear')));
  }
}
