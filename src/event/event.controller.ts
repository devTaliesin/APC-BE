import { Controller, Post, Get, Body } from '@nestjs/common';
import { EventReadService } from './event-read/event-read.service';
import { EventUpdateService } from './event-update/event-update.service';
import { EventCreateService } from './event-create/event-create.service';
import { Inandout, Sex } from '@prisma/client';


@Controller('event')
export class EventController {
  constructor(
    private readonly eventReadService: EventReadService,
    private readonly eventUpdateService: EventUpdateService,
    private readonly eventCreateService: EventCreateService
  ) {}

  @Post('create')
  async eventCreate(
    @Body('videoId') videoId: number,
    @Body('cropImage') cropImage: string,
  ) {
    if (!videoId || !cropImage) {
      return { error: 'videoId and cropImage is required' };
    }
    try {
      const createdData = await this.eventCreateService.createEventData(videoId, cropImage);
      return createdData;
    } catch (error) {
      return { error: `Failed to create event data ${videoId}`, details: error.message };
    }
  }

  @Post('update')
  async eventUpdate(
    @Body('id') id: number,
    @Body('faceId') faceId: number,
    @Body('inandout') inandout: Inandout,
    @Body('sex') sex: Sex,
  ) {
    if (!faceId) { 
      return { error: 'faceId is required' };
    }
    try {
      const updatedData = await this.eventUpdateService.updateEventData(id, faceId, inandout, sex);
      return updatedData;
    } catch (error) {
      return { error: `Failed to create event data ${faceId}`, details: error.message };
    }
  }

  @Get('daily_video_read')
  async dailyVideoEventRead(
    @Body('videoId') videoId:number, 
  ) {
    if ( !videoId ) { 
      return { error: 'faceId is required' };
    }
    try {
      const readDailyVideoData = await this.eventReadService.readDailyVideoEventData(videoId);
      return readDailyVideoData;
    } catch (error) {
      return { error: `Failed to create event data ${videoId}`, details: error.message };
    }
  }
  
  @Get('daily_face_id_read')
  async dailyFaceIdEventRead(
    @Body('faceId') faceId:number
  ) {
    if ( !faceId ) { 
      return { error: 'faceId is required' };
    }
    try {
      const readDailyFaceIdData = await this.eventReadService.readDailyFaceIdEventData(faceId);
      return readDailyFaceIdData;
    } catch (error) {
      return { error: `Failed to create event data ${faceId}`, details: error.message };
    }
  }
}
