import { Test, TestingModule } from '@nestjs/testing';
import { EventReadService } from './event-read.service';

describe('EventReadService', () => {
  let service: EventReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventReadService],
    }).compile();

    service = module.get<EventReadService>(EventReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
