import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { catchError, map, of } from 'rxjs';
import { Request } from 'express';

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

  jwt(header: any) {
    return this.userAuthClient.send({ cmd: 'jwt' }, header).pipe(
      map((data) => {
        console.log(`In Map: `, data);
        return data;
      }),
      catchError((e) => {
        console.log(`Catch Map : `, e);
        throw e;
      }),
    );
  }

  /** Todo: Replace to JWT */
  signIn(dto: CreateUserDto) {
    console.log(`Send DTO: `, { email: dto.email, password: dto.password });
    return this.userAuthClient
      .send(
        { cmd: 'sign_in' },
        { user: { email: dto.email, password: dto.password } },
      )
      .pipe(
        map((data) => {
          console.log(`In Map: `, data);
          return data;
        }),
        catchError((e) => {
          console.log(`Catch Map : `, e);
          throw e;
        }),
      );
  }
}
