import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class EventReadService {
  constructor(private prisma: PrismaService){}

  async readDailyVideoEventData(videoId:number){
    const oneDayAgo = subDays(new Date(), 1);
    try {
      const readEvent = await this.prisma.event.findMany({
        where: {
          videoId: videoId,
          datetime: {
            lt: oneDayAgo,
          }
        }
      });
      if ( readEvent.length === 0 ){
        return {message: 'No events found within the last day for this video ID.'}
      }
      return readEvent
    } catch (error) {
      throw new Error(`Failed to read daily video event: ${error.message}`)
    }
  }

  async readDailyFaceIdEventData(faceId:number){
    const oneDayAgo = subDays(new Date(), 1);
    try {
      const readEvent = await this.prisma.event.findMany({
        where: {
          videoId: faceId,
          datetime: {
            lt: oneDayAgo,
          }
        }
      });
      if ( readEvent.length === 0 ) {
        return {message: 'No events found within the last day for this face ID.'}
      }
      return readEvent
    } catch (error) {
      throw new Error(`Failed to read daily face ID event: ${error.message}`)
    }
  }
}
