import { Controller, Post, Get, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { CreateVideoSourceDto } from 'src/dto/create/create-videoSource.dto';
import { VideoSourceDto } from 'src/dto/videoSource.dto';
import { VideoSourceService } from 'src/services/video_source.service';

@Controller('video_source')
export class VideoSourceController {
  constructor(
    private readonly videoSourceService: VideoSourceService,
  ) {}

  @Post('create')
  async connectToDevice(
    @Body() createVideoSourceDto: CreateVideoSourceDto,
  ) : Promise<{data: VideoSourceDto}>{
    const device = await this.videoSourceService.createVideoSource(createVideoSourceDto);
    return {data: device}
  }

  @Get('read')
  async readBVideoSource() : Promise<{data: VideoSourceDto[]}> {
    const videoSourceInfo = await this.videoSourceService.readVideoSource();
    return {data: videoSourceInfo}
  }

  @Get('sse')
  async sendVideoSourceEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const subscription = this.videoSourceService
      .subscribeEvent()
      .subscribe((data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    res.on('close', () => {
      subscription.unsubscribe();
    });
  }
}
