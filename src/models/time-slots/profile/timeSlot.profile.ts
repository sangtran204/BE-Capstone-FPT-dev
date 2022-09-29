import { Injectable } from '@nestjs/common';
import { MappingProfile, createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { TimeSlotEntity } from '../entities/time-slots.entity';
import { TimeSlotDTO } from '../dto/time-slot.dto';

@Injectable()
export class TimeSlotProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, TimeSlotEntity, TimeSlotDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
