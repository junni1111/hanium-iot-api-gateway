import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DEVICE_HOST,
  DEVICE_PORT,
  GATEWAY_HOST,
  GATEWAY_PORT,
} from './config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LED, MASTER, THERMOMETER, WATER_PUMP } from './util/constants/swagger';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  setupSwagger(app);

  console.log(
    `geteway ENV:${process.env.NODE_ENV} - rest host ${GATEWAY_HOST}, rest PORT ${GATEWAY_PORT}, device HOST ${DEVICE_HOST} device PORT ${DEVICE_PORT}`,
  );

  console.log(`ENV List: `, process.env);
  await app.listen(GATEWAY_PORT);
}

bootstrap();
