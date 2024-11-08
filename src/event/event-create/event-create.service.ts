import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventCreateService {

  constructor(private prisma: PrismaService) {}

  async createEventData(videoId: number, cropImage:string) {
    try {
      const createdData = await this.prisma.event.create({
        data: {
          videoId: videoId,
          cropImage: cropImage
        }
      })
      if (!createdData) {
        return {message: `Can't events create for this video ID and crop image.`}
      }
      return createdData
    } catch (error) {
      throw new Error(`Failed to create event data: ${error.message}`)
    }   
  }
}
