import { Module } from '@nestjs/common';
import { VideoSourceController } from 'src/controllers/video_source.controller';
import { VideoSourceService } from 'src/services/video_source.service';

@Module({
  controllers: [VideoSourceController],
  providers: [VideoSourceService]
})
export class VideoSourceModule {}