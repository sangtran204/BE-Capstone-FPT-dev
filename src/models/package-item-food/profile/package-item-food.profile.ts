import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PackageItemFoodDTO } from '../dto/package-item-food.dto';
import { PackageItemFoodEntity } from '../entities/package-item-food.entity';
@Injectable()
export class PackageItemFoodProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PackageItemFoodEntity, PackageItemFoodDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
