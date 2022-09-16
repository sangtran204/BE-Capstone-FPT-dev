import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { StationPackageItemEntity } from './entiies/stationPackageItem.entity';
import { StationsService } from '../stations/stations.service';
import { PackageService } from '../packages/packages.service';
import { StationPackageItemDTO } from './dto/stationPackageItem.dto';

@Injectable()
export class StationPackageItemService extends BaseService<StationPackageItemEntity> {
  constructor(
    @InjectRepository(StationPackageItemEntity)
    private readonly stationPackageItemRepository: Repository<StationPackageItemEntity>,
    private readonly stationService: StationsService,
    private readonly packageService: PackageService,
  ) {
    super(stationPackageItemRepository);
  }

  async getAllSationPackageItem(): Promise<StationPackageItemEntity[]> {
    return this.stationPackageItemRepository.find({
      relations: { packagess: true, station: true },
    });
  }
  async getSationPackageItemByPackage(
    id: string,
  ): Promise<StationPackageItemEntity[]> {
    const stationFind = await this.stationService.findOne({
      where: { id: id },
    });
    if (!stationFind) {
      throw new HttpException(
        `Station id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      return this.stationPackageItemRepository.find(
        //   { where: { packageId: id } },
        {
          where: { station: stationFind },
          relations: { packagess: true, station: true },
        },
      );
    }
  }

  async createStationPackageItem(dto: StationPackageItemDTO): Promise<string> {
    try {
      const packageFind = await this.packageService.findOne({
        where: { id: dto.packageId },
      });
      const stationFind = await this.stationService.findOne({
        where: { id: dto.stationId },
      });

      if (!packageFind) {
        throw new HttpException(
          `Package Id ${dto.packageId} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (!stationFind) {
        throw new HttpException(
          `Station Id ${dto.stationId} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        await this.stationPackageItemRepository.save({
          station: stationFind,
          packagess: packageFind,
        });
        return 'Create station package item successfull';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteStationOnPackage(id: string): Promise<string> {
    const stationPackageItem = await this.stationPackageItemRepository.findOne({
      where: { id: id },
    });
    if (!stationPackageItem) {
      throw new HttpException(`item id ${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      await this.stationPackageItemRepository
        .createQueryBuilder()
        .delete()
        .from(StationPackageItemEntity)
        .where('id = :id', { id: id })
        .execute();
      return 'Delete station successfull';
    }
  }
}
