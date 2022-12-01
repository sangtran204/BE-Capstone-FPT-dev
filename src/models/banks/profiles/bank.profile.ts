import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { BankEntity } from '../entities/bank.entity';
import { BankDto } from '../dto/bank.dto';

@Injectable()
export class BankProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, BankEntity, BankDto);
    };
  }
}
