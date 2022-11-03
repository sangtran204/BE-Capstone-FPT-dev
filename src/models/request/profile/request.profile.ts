import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { RequestDTO } from '../dto/request.dto';
import { RequestEntity } from '../entities/request.entity';
@Injectable()
export class RequestProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, RequestEntity, RequestDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
