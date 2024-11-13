import { Test, TestingModule } from '@nestjs/testing';
import { VideoSourceSseService } from './video_source-sse.service';

describe('VideoSourceSseService', () => {
  let service: VideoSourceSseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoSourceSseService],
    }).compile();

    service = module.get<VideoSourceSseService>(VideoSourceSseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
