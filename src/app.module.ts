import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { HealthController } from './health.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './api/user/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../env/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    ApiModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
