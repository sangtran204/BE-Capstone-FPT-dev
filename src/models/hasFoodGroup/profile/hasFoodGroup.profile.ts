import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { HasFoodGroupEntity } from '../entities/hasFoodGroup.entity';
import { HasFoodGroupDTO } from '../dto/hasFoodGroup.dto';

@Injectable()
export class HasFoodGroupProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, HasFoodGroupEntity, HasFoodGroupDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
