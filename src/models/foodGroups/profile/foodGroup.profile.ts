import { Injectable } from '@nestjs/common';
import { MappingProfile, createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { FoodGroupDTO } from '../dto/foodGroup.dto';
import { FoodGroupEntity } from '../entities/foodGroups.entity';

@Injectable()
export class FoodGroupProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, FoodGroupDTO, FoodGroupEntity);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
