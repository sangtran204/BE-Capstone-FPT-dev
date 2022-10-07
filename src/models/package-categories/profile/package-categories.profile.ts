import { createMap, MappingProfile, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PackageCategoryDTO } from '../dto/package-category.dto';
import { PackageCategoryEntity } from '../entities/package-categories.entity';

@Injectable()
export class PackageCategoriesProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PackageCategoryEntity, PackageCategoryDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
