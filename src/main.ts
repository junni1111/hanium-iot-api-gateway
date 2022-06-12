import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DEVICE_HOST,
  EVENT_GATEWAY_PORT,
  API_GATEWAY_HOST,
  REST_GATEWAY_PORT,
} from './config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import {LED, MASTER, THERMOMETER, WATER_PUMP} from "./util/constants/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: EVENT_GATEWAY_PORT,
      host: API_GATEWAY_HOST,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('IoT Gateway API')
    .setDescription('IoT Microservice API 문서입니다')
    .setVersion('1.0.14')
    .addTag(MASTER)
    .addTag(THERMOMETER)
    .addTag(WATER_PUMP)
    .addTag(LED)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-spec', app, document);

  console.log(
    `geteway ENV:${process.env.NODE_ENV} - rest host ${API_GATEWAY_HOST}, rest PORT ${REST_GATEWAY_PORT}, device HOST ${DEVICE_HOST}`,
  );
  await app.listen(REST_GATEWAY_PORT);
}

bootstrap();
