import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Inandout, Sex } from '@prisma/client';

@Injectable()
export class EventUpdateService {

  constructor(private prisma: PrismaService) {}

  async updateEventData(id:number, faceId:number, inandout:Inandout, sex:Sex) {
    try {
      const updatedData = await this.prisma.event.update({
        where: {
          id: id,
        },
        data: {
          faceId: faceId,
          inandout: inandout,
          sex: sex
        }
      })
      if (!updatedData) {
        return {message: `Can't update create for this face ID and in and out, sex.`}
      }
      return updatedData
    } catch (error) {
      throw new Error(`Failed to update event data: ${error.message}`)
    }   
  }
}
