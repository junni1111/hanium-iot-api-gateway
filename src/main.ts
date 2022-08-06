import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './util/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
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
    `geteway ENV:${process.env.NODE_ENV} - rest host ${GATEWAY_HOST}, rest PORT ${GATEWAY_PORT}`,
  );

  console.log(`ENV List: `, process.env);
  await app.listen(GATEWAY_PORT, () => {
    console.log(`LISTENING HOST : ${GATEWAY_HOST}, PORT : ${GATEWAY_PORT}`);
  });
}

bootstrap();
