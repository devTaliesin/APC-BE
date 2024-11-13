import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { subDays } from "date-fns";
import { CreateEventDto } from "src/dto/create/create-event.dto";
import { UpdateEventDto } from "src/dto/update/update-event.dto";
import { Subject } from "rxjs";
import { EventDto } from "src/dto/event.dto";
import { handleDatabaseException } from "src/exceptions/database.exception";

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService
  ){}

  private EventEvents$ = new Subject();
  private readonly logger = new Logger(EventService.name);

  async createEventData(createEventDto: CreateEventDto): Promise<EventDto> {
    try {
      const createdData = await this.prisma.event.create({
        data: {
          videoId: createEventDto.video.id,
          cropImage: createEventDto.cropImage
        }
      })
      return createdData
    } catch (error) {
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
      return updatedData
    } catch (error) {
      handleDatabaseException(error)
    }   
  }

  subscribeEvent() {
    return this.EventEvents$.asObservable();
  }

  emitEvent(allDevice: EventDto[]) {
    this.EventEvents$.next(allDevice);
  }
}