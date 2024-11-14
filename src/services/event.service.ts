import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { subDays } from "date-fns";
import { CreateEventDto } from "src/dto/create/create-event.dto";
import { UpdateEventDto } from "src/dto/update/update-event.dto";
import { Subject } from "rxjs";
import { EventDto } from "src/dto/event.dto";
import { handleDatabaseException } from "src/exceptions/database.exception";
import { EventSseSubjectInterface } from "src/intserfaces/event.interface";

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService
  ){}

  private EventEvents$ = new Subject<EventSseSubjectInterface>();
  private readonly logger = new Logger(EventService.name);

  async createEventData(createEventDto: CreateEventDto): Promise<EventDto> {
    try {
      const createdData = await this.prisma.event.create({
        data: {
          videoId: createEventDto.video.id,
          cropImage: createEventDto.cropImage
        }
      })
      const readDailyVideoEvent = await this.readDailyVideoEventData(createEventDto.video.id)
      this.emitEvent({readDailyVideoEvent})
      return createdData
    } catch (error) {
      this.logger.error(error)
      handleDatabaseException(error)
    } 
  }

  async readDailyVideoEventData(videoId:number): Promise<EventDto[]>{
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
      return readEvent
    } catch (error) {
      this.logger.error(error)
      handleDatabaseException(error)
    }
  }

  async readDailyFaceIdEventData(faceId:number): Promise<EventDto[]> {
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
      return readEvent
    } catch (error) {
      this.logger.error(error)
      handleDatabaseException(error)
    }
  }

  async updateEventData(updateEventDto: UpdateEventDto): Promise<EventDto> {
    try {
      const updatedData = await this.prisma.event.update({
        where: {
          id: updateEventDto.id,
        },
        data: {
          faceId: updateEventDto.face.id,
          inandout: updateEventDto.inandout,
          sex: updateEventDto.sex
        }
      })
      const readDailyVideoEvent = await this.readDailyVideoEventData(updateEventDto.face.id)
      const readDailyFaceIdEvent = await this.readDailyFaceIdEventData(updatedData.faceId)
      this.emitEvent({readDailyVideoEvent, readDailyFaceIdEvent})
      return updatedData
    } catch (error) {
      this.logger.error(error)
      handleDatabaseException(error)
    }   
  }

  subscribeEvent() {
    return this.EventEvents$.asObservable();
  }

  emitEvent(readData: EventSseSubjectInterface) {
    this.EventEvents$.next(readData);
  }
}