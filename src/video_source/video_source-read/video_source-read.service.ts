import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VideoSourceReadService {

  constructor(private prisma: PrismaService){}

  async readVideoSource () {
    try {
      const videoSourceInfo = await this.prisma.videoSource.findMany()

      if (videoSourceInfo.length === 0){
        return {message: 'No video source found'}
      }
      return videoSourceInfo
    } catch (error) {
      throw new Error(`Failed to read video source: ${error.message}`)
    }
  }
}