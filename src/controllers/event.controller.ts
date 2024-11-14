import { Controller, Post, Get, Body, Res, Query, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateEventDto } from 'src/dto/create/create-event.dto';
import { EventDto } from 'src/dto/event.dto';
import { UpdateEventDto } from 'src/dto/update/update-event.dto';
import { EventService } from 'src/services/event.service';
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
  ) {}


  @Post('create')
  @ApiBody({ 
    type: CreateEventDto,
  })
  async eventCreate(
    @Body() createEventDto: CreateEventDto,
  ) :Promise<{data: EventDto}> {
    const createdData = await this.eventService.createEventData(createEventDto);
    return {data: createdData};
  }

  @Patch('update')
  @ApiBody({ 
    type: UpdateEventDto,
  })
  async eventUpdate(
    @Body() updateEventDto: UpdateEventDto,
  ) :Promise<{data: EventDto}> {
    const updatedData = await this.eventService.updateEventData(updateEventDto);
    return {data: updatedData};
  }

  @Get('daily_video_read')
  async dailyVideoEventRead(
    @Query('videoId', ParseIntPipe) videoId: number, 
  ) :Promise<{data: EventDto[]}> {
    const readDailyVideoData = await this.eventService.readDailyVideoEventData(videoId);
    return {data: readDailyVideoData};
  }
  
  @Get('daily_face_id_read')
  async dailyFaceIdEventRead(
    @Query('faceId', ParseIntPipe) faceId: number
  ) :Promise<{data: EventDto[]}> {
    const readDailyFaceIdData = await this.eventService.readDailyFaceIdEventData(faceId);
    return {data: readDailyFaceIdData};
  }

  @Get('sse')
  async sendVideoSourceEvents(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const subscription = this.eventService
      .subscribeEvent()
      .subscribe((data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    res.on('close', () => {
      subscription.unsubscribe();
    });
  }
}
