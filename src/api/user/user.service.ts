import { Inject, Injectable } from '@nestjs/common';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { HttpService } from '@nestjs/axios';
import { requestUrl } from '../../config/config';
import { AxiosResponse } from 'axios';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_AUTH_MICROSERVICE) private userAuthClient: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  ping() {
    return this.userAuthClient.send('ping', 'pong').pipe((data) => data);
  }

  signUp(createUserDto: CreateUserDto): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.post(
      `${requestUrl}/signup`,
      createUserDto,
    );
  }

  jwt(jwt: string): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(`${requestUrl}/jwt?jwt=${jwt}`);
  }

  refresh(tokens: any): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(
      `${requestUrl}/refresh?access=${tokens.accessToken}&refresh=${tokens.refreshToken}`,
    );
  }

  /** Todo: Replace to JWT */
  signIn(signInDto: SignInDto): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.post(`${requestUrl}/signin`, {
      email: signInDto.email,
      password: signInDto.password,
    });
  }
}
