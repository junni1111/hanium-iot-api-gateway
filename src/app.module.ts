import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { DataBaseConfigModule } from './config/database/database.module';
import { DataBaseConfigService } from './config/database/database.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/../env/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DataBaseConfigModule],
      useClass: DataBaseConfigService,
      inject: [DataBaseConfigService],
    }),
    ApiModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
