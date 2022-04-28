import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ApiModule],
  controllers: [HealthController],
})
export class AppModule {}
