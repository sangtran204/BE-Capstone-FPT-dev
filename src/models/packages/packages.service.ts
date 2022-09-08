import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    return await this.packagesRepository.find({
      where: { isActive: isActive },
    });
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

  async updatePackage(id: string, dto: PackageDTO): Promise<string> {
    const packageId = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (!packageId) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      await this.packagesRepository.update(
        { id: id },
        {
          name: dto.name,
          description: dto.description,
          totalGroupItem: dto.totalGroupItem,
          price: dto.price,
        },
      );
      return 'Update package successfull';
    }
  }

  async updateStatus(id: string): Promise<boolean> {
    const packages = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (!packages) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      if (
        packages.isActive == IsActiveEnum.WAITING ||
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
        return true;
      }
    }
  }

  async deletePackage(id: string): Promise<string> {
    const packages = await this.packagesRepository.findOne({
      where: { id: id },
    });
    if (packages) {
      await this.packagesRepository
        .createQueryBuilder()
        .delete()
        .from(PackageEntity)
        .where('id = :id', { id: id })
        .execute();
      return `Delete Successfully : ${id}`;
    } else {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    }
  }
}
