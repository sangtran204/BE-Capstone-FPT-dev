import { Injectable } from '@nestjs/common';
import { MappingProfile, createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { CategoryEntity } from '../entities/categories.entity';
import { CategoryDTO } from '../dto/category.dto';

@Injectable()
export class CategoriesProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CategoryEntity, CategoryDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
