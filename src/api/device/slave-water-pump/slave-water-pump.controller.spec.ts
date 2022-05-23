import { Test, TestingModule } from '@nestjs/testing';
import { SlaveWaterPumpController } from '../slave-water-pump.controller';

describe('SlaveWaterPumpController', () => {
  let controller: SlaveWaterPumpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlaveWaterPumpController],
    }).compile();

    controller = module.get<SlaveWaterPumpController>(SlaveWaterPumpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
