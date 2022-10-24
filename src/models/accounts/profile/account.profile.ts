import { AccountEntity } from '../entities/account.entity';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AccountInfoDTO } from '../dto/account-info..dto';
import { AccountDTO } from '../dto/accounts.dto';

@Injectable()
export class AccountProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      // createMap(mapper, AccountEntity, AccountInfoDTO);
      createMap(
        mapper,
        AccountEntity,
        AccountInfoDTO,
        forMember(
          (destination) => destination.customer,
          mapFrom((s) => s.customer),
        ),
        forMember(
          (destination) => destination.kitchen,
          mapFrom((s) => s.kitchen),
        ),
        forMember(
          (destination) => destination.shipper,
          mapFrom((s) => s.shipper),
        ),
      );

      createMap(mapper, AccountEntity, AccountDTO);
    };
  }
}
