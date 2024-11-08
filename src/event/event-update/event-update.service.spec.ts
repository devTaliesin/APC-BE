import { Test, TestingModule } from '@nestjs/testing';
import { EventUpdateService } from './event-update.service';

describe('EventUpdateService', () => {
  let service: EventUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventUpdateService],
    }).compile();

    service = module.get<EventUpdateService>(EventUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
