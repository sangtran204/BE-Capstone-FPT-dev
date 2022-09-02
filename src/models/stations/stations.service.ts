import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StationEntity } from './entities/stations.entity';
import { BaseService } from '../base/base.service';
import { IsActiveEnum } from '../../common/enums/isActive.enum';
import { StationDTO } from './dto/stations.dto';

@Injectable()
export class StationsService extends BaseService<StationEntity> {
  constructor(
    @InjectRepository(StationEntity)
    private readonly stationsRepository: Repository<StationEntity>,
  ) {
    super(stationsRepository);
  }

  async getStations(): Promise<StationEntity[]> {
    return await this.stationsRepository.find({
      where: { isActive: IsActiveEnum.ACTIVE },
    });
  }

  async deleteStation(id: string): Promise<boolean> {
    try {
      await this.stationsRepository.update(
        { id: id },
        { isActive: IsActiveEnum.IN_ACTIVE },
      );
      return true;
    } catch {
      return false;
    }
  }

  async updateStation(id: string, dto: StationDTO): Promise<boolean> {
    // try {
    await this.stationsRepository.update(
      { id: id },
      {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        openTime: dto.openTime,
        closeTime: dto.closeTime,
      },
    );
    return true;
    // return true;
    // } catch {
    // return false;
    // }
  }
}
