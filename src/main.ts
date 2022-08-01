import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './util/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './api/user/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const DEVICE_HOST = configService.get<string>('DEVICE_HOST');
  const DEVICE_PORT =
    configService.get<number>('DEVICE_PORT_8888_TCP_PORT') ||
    configService.get<number>('DEVICE_PORT', 8888);
  const GATEWAY_HOST = configService.get<string>('GATEWAY_HOST');
  const GATEWAY_PORT = configService.get<number>('GATEWAY_PORT', 7777);

  app.enableCors({
    origin: true,
    credentials: true,
  });
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
