import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { TimeFrameEntity } from '../entities/time-frame.entity';
import { TimeFrameDTO } from '../dto/time-frame.dto';

@Injectable()
export class TimeFrameProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, TimeFrameEntity, TimeFrameDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
