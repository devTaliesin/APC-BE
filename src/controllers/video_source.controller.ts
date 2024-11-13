import { Controller, Post, Get, HttpStatus, Res, Req, Body } from '@nestjs/common';
import { Response } from 'express';
import { CreateVideoSourceDto } from 'src/dto/create/create-videoSource.dto';
import { VideoSourceService } from 'src/services/video_source.service';



@Controller('video_source')
export class VideoSourceController {
  constructor(
    private readonly videoSourceService: VideoSourceService,
  ) {}

  @Post('create')
  async connectToDevice(
    @Body() createVideoSourceDto: CreateVideoSourceDto,
    @Res() res:Response
  ) {
    if (!createVideoSourceDto.rtsp||!createVideoSourceDto.user||!createVideoSourceDto.pass) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Invalid input data' });
    }
    try {
      const device = await this.videoSourceService.createVideoSource(createVideoSourceDto);
      return res
        .status(HttpStatus.CREATED)
        .json(device);
    } catch (error) {
      
    }
  }

  @Get('read')
  async readBVideoSource(@Res() res: Response) {
    try {
      const videoSourceInfo = await this.videoSourceService.readVideoSource();

      if (videoSourceInfo.length === 0) {
        return res
          .status(HttpStatus.NO_CONTENT)
          .json({ message: 'No video source found' });
      }

      return res.status(HttpStatus.OK).json(videoSourceInfo);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
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
