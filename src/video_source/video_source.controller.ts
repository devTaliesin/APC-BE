import { Controller, Post, Body, Get } from '@nestjs/common';
import { VideoSourceCreateService } from './video_source-create/video_source-create.service';
import { VideoSourceReadService } from './video_source-read/video_source-read.service';

@Controller('video_source')
export class VideoSourceController {
  constructor(
    private readonly videoSourceCreateService: VideoSourceCreateService,
    private readonly videoSourceReadService: VideoSourceReadService
  ) {}

  @Post('create')
  async connectToDevice(
    @Body('ip') ip: string,
    @Body('name') name: string,
    @Body('port') port: number = 80,
    @Body('user') user: string = 'admin',
    @Body('pass') pass: string = 'password'
  ) {
    if (!ip) {
      return { error: 'IP address is required' };
    }
    try {
      const device = await this.videoSourceCreateService.createVideoSource(ip, name, port, user, pass);
      return device;
    } catch (error) {
      return { error: `Failed to connect to ONVIF device at ${ip}`, details: error.message };
    }
  }

  @Get('read')
  getConnectedDevices() {
    return this.videoSourceReadService.readVideoSource();
  }
}
