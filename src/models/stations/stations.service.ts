import { Like, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StationEntity } from './entities/stations.entity';
import { BaseService } from '../base/base.service';
import { CreateStationDTO } from './dto/create-station.dto';
import { UpdateStationDTO } from './dto/update-station.dto';
import { StatusEnum } from 'src/common/enums/status.enum';
import {
  StationByKitchenId,
  StationStatusFilter,
} from './dto/stations-filter.dto';
import { AccountEntity } from '../accounts/entities/account.entity';

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

  async getStationByKitchenId(
    filter: StationByKitchenId,
  ): Promise<StationEntity[]> {
    const { kitchenId } = filter;
    const stations = await this.stationsRepository.find({
      where: { kitchen: { id: kitchenId }, status: StatusEnum.ACTIVE },
    });
    if (!stations || stations.length == 0) {
      throw new HttpException('No stations found', HttpStatus.NOT_FOUND);
    }
    return stations;
  }

  async getStationsByStatus(
    statusFilter: StationStatusFilter,
  ): Promise<StationEntity[]> {
    const { status } = statusFilter;
    return await this.stationsRepository.find({
      where: { status: Like(Boolean(status) ? status : '%%') },
    });
  }

  async getAllActiveStations(): Promise<StationEntity[]> {
    return await this.stationsRepository.find({
      where: { status: StatusEnum.ACTIVE },
    });
  }

  async createStation(dto: CreateStationDTO): Promise<StationEntity> {
    return await this.save({
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      openTime: dto.openTime,
      closeTime: dto.closeTime,
    });
  }

  async updateStatusStation(id: string): Promise<string> {
    const station = await this.stationsRepository.findOne({
      where: { id: id },
    });
    if (!station) {
      throw new HttpException(
        `${id} : station not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (station.status == StatusEnum.ACTIVE) {
        await this.stationsRepository.update(
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );
        return 'Station now is inActive';
      } else if (station.status == StatusEnum.IN_ACTIVE) {
        await this.stationsRepository.update(
          { id: id },
          { status: StatusEnum.ACTIVE },
        );
        return 'Station now is active';
      }
    }
  }

  async updateStation(id: string, dto: UpdateStationDTO): Promise<string> {
    const station = await this.stationsRepository.findOne({
      where: { id: id },
    });
    if (station) {
      await this.save({
        id: id,
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        openTime: dto.openTime,
        closeTime: dto.closeTime,
      });
      return 'Update station successfull';
    } else {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    }
  }

  async getStationByKitchen(user: AccountEntity): Promise<StationEntity[]> {
    const list = await this.stationsRepository.find({
      where: { status: StatusEnum.ACTIVE, kitchen: { id: user.id } },
    });

    if (!list || list.length == 0) {
      throw new HttpException('No station found', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }
}
