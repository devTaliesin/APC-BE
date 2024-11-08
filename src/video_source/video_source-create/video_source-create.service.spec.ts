import { Test, TestingModule } from '@nestjs/testing';
import { VideoSourceCreateService } from './video_source-create.service';

describe('VideoSourceCreateService', () => {
  let service: VideoSourceCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoSourceCreateService],
    }).compile();

    service = module.get<VideoSourceCreateService>(VideoSourceCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
