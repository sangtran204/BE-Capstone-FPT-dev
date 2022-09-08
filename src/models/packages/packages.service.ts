import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { PackageEntity } from './entities/packages.entity';
import { PackageDTO } from './dto/packages.dto';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';

@Injectable()
export class PackageService extends BaseService<PackageEntity> {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packagesRepository: Repository<PackageEntity>,
  ) {
    super(packagesRepository);
  }

  async listAllPackage(): Promise<PackageEntity[]> {
    return await this.packagesRepository.find();
  }

  async listPackageStatus(isActive: string): Promise<PackageEntity[]> {
    if (isActive.trim().length == 0) {
      return await this.packagesRepository.find();
    } else {
      return await this.packagesRepository.find({
        where: { isActive: isActive },
      });
    }
  }

  async createPackage(dto: PackageDTO): Promise<boolean> {
    try {
      await this.packagesRepository.save({
        name: dto.name,
        description: dto.description,
        totalGroupItem: dto.totalGroupItem,
        price: dto.price,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updatePackage(id: string, dto: PackageDTO): Promise<boolean> {
    await this.packagesRepository.findOne({
      where: { id: id.trim() },
    });
    const update = await this.packagesRepository.update(
      { id: id },
      {
        name: dto.name,
        description: dto.description,
        totalGroupItem: dto.totalGroupItem,
        price: dto.price,
      },
    );
    if (update.affected == 1) {
      return true;
    } else {
      return false;
    }
  }

  async updateStatus(id: string): Promise<boolean> {
    const packages = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (
      (packages != null && packages.isActive == IsActiveEnum.WAITING) ||
      packages.isActive == IsActiveEnum.IN_ACTIVE
    ) {
      await this.packagesRepository.update(
        { id: id },
        {
          isActive: IsActiveEnum.ACTIVE,
        },
      );
      return true;
    } else if (packages.isActive == IsActiveEnum.ACTIVE) {
      await this.packagesRepository.update(
        { id: id },
        {
          isActive: IsActiveEnum.IN_ACTIVE,
        },
      );
      return false;
    }
  }

  async deletePackage(id: string): Promise<boolean> {
    const packages = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (packages != null) {
      await this.packagesRepository
        .createQueryBuilder()
        .delete()
        .from(PackageEntity)
        .where('id=:id', { id: id })
        .execute();
      return true;
    } else {
      return false;
    }
  }
}
