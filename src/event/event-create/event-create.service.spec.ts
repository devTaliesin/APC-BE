import { Test, TestingModule } from '@nestjs/testing';
import { EventCreateService } from './event-create.service';

describe('EventCreateService', () => {
  let service: EventCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventCreateService],
    }).compile();

    service = module.get<EventCreateService>(EventCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
