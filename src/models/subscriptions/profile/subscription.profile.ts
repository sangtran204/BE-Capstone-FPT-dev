import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { SubscriptionDTO } from '../dto/subscription.dto';
import { SubscriptionEntity } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => createMap(mapper, SubscriptionEntity, SubscriptionDTO);
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
