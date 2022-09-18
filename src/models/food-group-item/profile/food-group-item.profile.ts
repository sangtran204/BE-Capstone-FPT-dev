import { Injectable } from '@nestjs/common';
import { MappingProfile, createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { FoodGroupItemEntity } from '../entities/food-group-item.entity';
import { FoodGroupItemDTO } from '../dto/food-group-item.dto';

@Injectable()
export class FoodGroupItemProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, FoodGroupItemEntity, FoodGroupItemDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
