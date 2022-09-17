import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PackageItemDTO } from '../dto/packageItem.dto';
import { PackageItemEntity } from '../entities/packageItem.entity';

@Injectable()
export class PackageItemProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PackageItemEntity, PackageItemDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
