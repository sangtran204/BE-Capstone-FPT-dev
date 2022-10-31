import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { FeedBackEntity } from '../entities/feedback.entity';
import { FeedBackDTO } from '../dto/feedback.dto';

@Injectable()
export class FeedBackProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, FeedBackEntity, FeedBackDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
