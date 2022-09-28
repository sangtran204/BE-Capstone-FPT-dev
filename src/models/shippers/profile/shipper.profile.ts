import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { ShipperDTO } from '../dto/shipper.dto';
import { ShipperEntity } from '../entities/shipper.entity';

export class ShipperProfile extends AutomapperProfile {
  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        ShipperEntity,
        ShipperDTO,
        forMember(
          (destination) => destination.profile,
          mapFrom((s) => s.account.profile),
        ),
      );
      createMap(mapper, ShipperEntity, ShipperDTO);
    };
  }
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
}
