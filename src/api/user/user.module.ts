import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_AUTH_HOST, USER_AUTH_PORT } from '../../config/config';
import { USER_AUTH_MICROSERVICE } from '../../util/constants/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilityController } from './utility.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_AUTH_MICROSERVICE,
        transport: Transport.TCP,
        options: {
          host: USER_AUTH_HOST,
          port: USER_AUTH_PORT,
        },
      },
    ]),
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
  ],
  controllers: [UserController, UtilityController],
  providers: [UserService],
})
export class UserModule {}
