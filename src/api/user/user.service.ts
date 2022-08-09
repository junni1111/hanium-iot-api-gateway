import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from './dto/send-message.dto';
import { TokensDto } from './dto/tokens.dto';
import { User } from './entities/user.entity';
import { ValidateJwtDto } from './dto/validate-jwt.dto';
import { AuthUserDto } from './dto/auth-user.dto';

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
    return lastValueFrom(this.httpService.get(this.requestUrl(''))).then(
      (res) => res.data,
    );
  }

  me(user: AuthUserDto) {
    return lastValueFrom(this.httpService.get(this.requestUrl(''))).then(
      (res) => res.data,
    );
  }

  signUp(createUserDto: CreateUserDto): Promise<User> {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('signup'), createUserDto),
    ).then((res) => res.data);
  }

  jwt(jwt: string): Promise<ValidateJwtDto> {
    return lastValueFrom(
      this.httpService.get(this.requestUrl('jwt'), { params: { jwt } }),
    ).then((res) => res.data);
  }

  refresh(tokens: any) {
    return lastValueFrom(
      this.httpService.get(this.requestUrl('refresh'), {
        params: {
          userId: tokens.userId,
          refresh: tokens.refreshToken,
        },
      }),
    ).then((res) => res.data);
  }

  /** Todo: Replace to JWT */
  signIn(signInDto: SignInDto): Promise<TokensDto> {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('signin'), {
        email: signInDto.email,
        password: signInDto.password,
      }),
    ).then((res) => res.data);
  }

  signOut(userId: number) {
    return lastValueFrom(
      this.httpService.get(this.requestUrl('signout'), {
        params: {
          userId,
        },
      }),
    ).then((res) => res.data);
  }

  sendMessage(sendMessageDto: SendMessageDto) {
    return lastValueFrom(
      this.httpService.post(this.requestUrl('message'), sendMessageDto),
    ).then((res) => res.data);
  }

  clearUserDB() {
    return lastValueFrom(this.httpService.delete(this.requestUrl('db'))).then(
      (res) => res.data,
    );
  }
}
