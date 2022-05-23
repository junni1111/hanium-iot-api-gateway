import { Test, TestingModule } from '@nestjs/testing';
import { SlaveTemperatureController } from '../slave-temperature.controller';

describe('SlaveTemperatureController', () => {
  let controller: SlaveTemperatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlaveTemperatureController],
    }).compile();

    controller = module.get<SlaveTemperatureController>(
      SlaveTemperatureController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
