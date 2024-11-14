import { EventDto } from "src/dto/event.dto";

export interface EventSseSubjectInterface{
  readDailyVideoEvent: EventDto[], readDailyFaceIdEvent?: EventDto[]
}