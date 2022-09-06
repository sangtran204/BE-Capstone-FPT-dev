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
    return await this.stationsRepository.find();
  }
  async getAllActiveStations(): Promise<StationEntity[]> {
    return await this.stationsRepository.find({
      where: { isActive: IsActiveEnum.ACTIVE },
    });
  }

  async createStation(dto: StationDTO): Promise<boolean> {
    try {
      await this.stationsRepository.save({
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        openTime: dto.openTime,
        closeTime: dto.closeTime,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteStation(id: string): Promise<boolean> {
    const station = await this.stationsRepository.findOne({
      where: { id: id },
    });
    if (station == null) {
      return false;
    } else {
      if (station.isActive == IsActiveEnum.ACTIVE) {
        await this.stationsRepository.update(
          { id: id },
          { isActive: IsActiveEnum.IN_ACTIVE },
        );
      } else if (station.isActive == IsActiveEnum.IN_ACTIVE) {
        await this.stationsRepository.update(
          { id: id },
          { isActive: IsActiveEnum.ACTIVE },
        );
      }
      return true;
    }
  }

  async updateStation(id: string, dto: StationDTO): Promise<boolean> {
    const station = await this.stationsRepository.findOne({
      where: { id: id },
    });
    if (station != null) {
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
    } else {
      return false;
    }
  }
}
