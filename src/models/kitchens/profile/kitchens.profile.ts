import { Injectable } from '@nestjs/common';
import { MappingProfile, createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { KitchenEntity } from '../entities/kitchens.entity';
import { KitchenDTO } from '../dto/kitchen.dto';

@Injectable()
export class KitchenProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, KitchenEntity, KitchenDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
