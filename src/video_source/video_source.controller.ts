import { Controller, Post, Get, HttpStatus, Res, Req, Body } from '@nestjs/common';
import { VideoSourceCreateService } from './video_source-create/video_source-create.service';
import { VideoSourceReadService } from './video_source-read/video_source-read.service';
import { CreateVideoSourceDto } from './dto/create-video-source.dto';
import { Response } from 'express';
import { OnvifConnectionError, OnvifAuthenticationError, DatabaseError } from './video_source.errors';
import { VideoSourceSseService } from './video_source-sse/video_source-sse.service';

@Controller('video_source')
export class VideoSourceController {
  constructor(
    private readonly videoSourceCreateService: VideoSourceCreateService,
    private readonly videoSourceReadService: VideoSourceReadService,
    private readonly videoSourceSseService: VideoSourceSseService
  ) {}

  @Post('create')
  async connectToDevice(
    @Body() createVideoSourceDto: CreateVideoSourceDto,
    @Res() res:Response
  ) {
    if (!createVideoSourceDto.ip||!createVideoSourceDto.name||!createVideoSourceDto.port||!createVideoSourceDto.user||!createVideoSourceDto.pass) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Invalid input data' });
    }
    try {
      const device = await this.videoSourceCreateService.createVideoSource(createVideoSourceDto);
      return res
        .status(HttpStatus.CREATED)
        .json(device);
    } catch (error) {
      if (error instanceof OnvifConnectionError) {
        return res
        .status(HttpStatus.BAD_GATEWAY)
        .json({ error: error.message });
      } else if (error instanceof OnvifAuthenticationError) {
        return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: error.message });
      } else if (error instanceof DatabaseError) {
        return res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json({ error: error.message });
      } else {
        return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
      };
    }
  }

  @Get('read')
  async readBVideoSource(@Res() res: Response) {
    try {
      const videoSourceInfo = await this.videoSourceReadService.readVideoSource();

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

  @Get('events')
  async sendVideoSourceEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE connection

    // SSE 연결 시 클라이언트에게 실시간 이벤트 전송
    const subscription = this.videoSourceSseService
      .getVideoSourceEvents()
      .subscribe((data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      });

    // 클라이언트가 연결을 끊을 때 구독 취소
    res.on('close', () => {
      subscription.unsubscribe();
    });
  }
}
