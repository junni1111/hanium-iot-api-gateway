import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { catchError, map, of } from 'rxjs';

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

  /** Todo: Replace to JWT */
  signIn(dto: CreateUserDto) {
    console.log(`Send DTO: `, { email: dto.email, password: dto.password });
    return this.userAuthClient
      .send({ cmd: 'sign_in' }, { email: dto.email, password: dto.password })
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
