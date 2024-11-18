import { Event } from "src/entities/event.entity";

export interface EventSseSubjectInterface{
  readDailyVideoEvent: Event[], readDailyFaceIdEvent?: Event[]
}