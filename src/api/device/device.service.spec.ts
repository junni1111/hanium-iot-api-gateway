import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceService],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  it('should be fetch last 1 week temperature from db', () => {
    expect(service).toBeDefined();
  });
});
