import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { OrderEntity } from '../entities/order.entity';
import { OrderDTO } from '../dto/order.dto';

@Injectable()
export class OrderProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => createMap(mapper, OrderEntity, OrderDTO);
  }

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
