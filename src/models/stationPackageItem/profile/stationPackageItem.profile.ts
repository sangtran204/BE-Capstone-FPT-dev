import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { StationPackageItemEntity } from '../entiies/stationPackageItem.entity';
import { StationPackageItemDTO } from '../dto/stationPackageItem.dto';

@Injectable()
export class StationPackageItemProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, StationPackageItemEntity, StationPackageItemDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
