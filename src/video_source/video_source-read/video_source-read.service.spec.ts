import { Test, TestingModule } from '@nestjs/testing';
import { VideoSourceReadService } from './video_source-read.service';

describe('VideoSourceReadService', () => {
  let service: VideoSourceReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoSourceReadService],
    }).compile();

    service = module.get<VideoSourceReadService>(VideoSourceReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
