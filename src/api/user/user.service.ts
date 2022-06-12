import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { catchError, map, of } from 'rxjs';
import { Request } from 'express';
import { constants } from 'http2';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_AUTH_MICROSERVICE) private userAuthClient: ClientProxy,
  ) {}
  signUp(dto: CreateUserDto) {
    return this.userAuthClient.send({ cmd: 'sign_up' }, dto).pipe(
      map((data) => {
        if (!data.id) {
          throw data;
        }

        return data;
      }),
      catchError((e) => {
        throw e.response;
      }),
    );
  }

  jwt(jwt: string) {
    return this.userAuthClient.send({ cmd: 'jwt' }, jwt).pipe(
      map((user) => {
        Logger.debug(user);
        return user;
      }),
      catchError((e) => {
        Logger.error(e);
        throw e;
      }),
    );
  }

  refresh(tokens: any) {
    return this.userAuthClient.send({ cmd: 'refresh' }, tokens).pipe(
      map((data) => data),
      catchError((e) => {
        throw e;
      }),
    );
  }

  /** Todo: Replace to JWT */
  signIn(dto: SignInDto) {
    Logger.debug(`Send DTO: `, { email: dto.email, password: dto.password });
    return this.userAuthClient
      .send(
        { cmd: 'sign_in' },
        { user: { email: dto.email, password: dto.password } },
      )
      .pipe(
        map((data) => {
          Logger.debug(`In Map: `, data);
          return data;
        }),
        catchError((e) => {
          Logger.debug(`Catch Map : `, e);
          throw e;
        }),
      );
  }
}
