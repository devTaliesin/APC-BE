import {
  Controller,
  Post,
  Get,
  Res,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateVideoSourceDto } from 'src/dto/create/create-videoSource.dto';
import { DeleteVideoSourceDto } from 'src/dto/delete/delete-videoSource';
import { UpdateVideoSourceDto } from 'src/dto/update/update-videoSource.dto';
import { VideoSourceDto } from 'src/dto/videoSource.dto';
import { VideoSourceService } from 'src/services/video_source.service';

@Controller('video_source')
export class VideoSourceController {
  constructor(private readonly videoSourceService: VideoSourceService) {}

  @Post('create')
  async connectToDevice(
    @Body() createVideoSourceDto: CreateVideoSourceDto,
  ): Promise<{ data: VideoSourceDto }> {
    const createdVideoSource =
      await this.videoSourceService.createVideoSource(createVideoSourceDto);
    return { data: createdVideoSource };
  }

  @Get('read')
  async readBVideoSource(): Promise<{ data: VideoSourceDto[] }> {
    const videoSourceInfo = await this.videoSourceService.readVideoSource();
    return { data: videoSourceInfo };
  }

  @Patch('update')
  async updateVideoSource(
    @Body() updateVideoSourceDto: UpdateVideoSourceDto,
  ): Promise<{ data: VideoSourceDto }> {
    const updatedVideoSource =
      await this.videoSourceService.updateVideoSource(updateVideoSourceDto);
    return { data: updatedVideoSource };
  }

  @Delete('delete')
  async deleteVideoSource(@Body() deleteVideoSourceDto: DeleteVideoSourceDto) {
    await this.videoSourceService.deleteVideoSource(deleteVideoSourceDto);
    return {
      message: `${deleteVideoSourceDto.id} ID videoSource has been deleted`,
    };
  }

  @Get('sse')
  async sendVideoSourceEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const initialData = await this.videoSourceService.readVideoSource();
    res.write(`data: ${JSON.stringify(initialData)}\n\n`);

    const subscription = this.videoSourceService
      .subscribeEvent()
      .subscribe(async (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      });

    res.on('close', () => {
      subscription.unsubscribe();
    });
  }
}
