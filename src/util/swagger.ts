import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { LED, MASTER, THERMOMETER, WATER_PUMP } from './constants/swagger';

const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('IoT Gateway API')
    .setDescription('IoT Gateway API 문서입니다')
    .setVersion('1.0.14')
    .addTag(MASTER)
    .addTag(THERMOMETER)
    .addTag(WATER_PUMP)
    .addTag(LED)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-spec', app, document, swaggerCustomOptions);
};
