import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { event_gateway_port, gateway_host, rest_gateway_port } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: event_gateway_port,
      host: gateway_host,
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
    .setVersion('1.0.10')
    .addTag('echo')
    .addTag('led')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-spec', app, document);

  console.log(
    `geteway ENV - rest host${gateway_host}, rest PORT ${rest_gateway_port}`,
  );
  await app.listen(rest_gateway_port);
}

bootstrap();
