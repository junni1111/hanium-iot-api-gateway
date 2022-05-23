import { Test, TestingModule } from '@nestjs/testing';
import { SlaveLedController } from '../slave-led.controller';

describe('SlaveLedController', () => {
  let controller: SlaveLedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlaveLedController],
    }).compile();

    controller = module.get<SlaveLedController>(SlaveLedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
