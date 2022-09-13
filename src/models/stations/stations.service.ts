import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async createStation(dto: StationDTO): Promise<StationEntity> {
    try {
      return await this.stationsRepository.save({
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        openTime: dto.openTime,
        closeTime: dto.closeTime,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteStation(id: string): Promise<string> {
    const station = await this.stationsRepository.findOne({
      where: { id: id },
    });
    if (station == null) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      {
        await this.stationsRepository.update(
          { id: id },
          { isActive: IsActiveEnum.IN_ACTIVE },
        );
      }
      return 'Delete station successfull';
    }
  }

  async updateStation(id: string, dto: StationDTO): Promise<string> {
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
          isActive: dto.isActive,
        },
      );
      return 'Update station successfull';
    } else {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    }
  }
}
