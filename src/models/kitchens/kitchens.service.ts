import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { IsActiveEnum } from 'src/common/enums/isActive.enum';
import { KitchenEntity } from './entities/kitchens.entity';
import { KitchenDTO } from './dto/kitchen.dto';

@Injectable()
export class KitchenService extends BaseService<KitchenEntity> {
  constructor(
    @InjectRepository(KitchenEntity)
    private readonly kitchensRepository: Repository<KitchenEntity>,
  ) {
    super(kitchensRepository);
  }

  async getAllKitchen(): Promise<KitchenEntity[]> {
    return await this.kitchensRepository.find();
  }

  // async searchKitchenByName(name: string): Promise<KitchenEntity[]> {
  //   return await this.kitchensRepository.find({
  //     where: { name: '%' + name + '%' },
  //   });
  // }

  async createKitchen(dto: KitchenDTO): Promise<string> {
    try {
      await this.kitchensRepository.save({
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
      });
      return 'Create kitchen successfull';
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateKitchen(id: string, dto: KitchenDTO): Promise<string> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
    });
    if (!kitchen) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      try {
        await this.kitchensRepository.update(
          { id: id },
          {
            name: dto.name,
            address: dto.address,
            phone: dto.phone,
          },
        );
        return 'Update package succesfull';
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async updateKitchenStatus(id: string): Promise<string> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
    });
    if (!kitchen) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      if (kitchen.isActive == IsActiveEnum.ACTIVE) {
        await this.kitchensRepository.update(
          { id: id },
          { isActive: IsActiveEnum.IN_ACTIVE },
        );
        return 'Kitchen inActive';
      } else if (kitchen.isActive == IsActiveEnum.IN_ACTIVE) {
        await this.kitchensRepository.update(
          { id: id },
          { isActive: IsActiveEnum.ACTIVE },
        );
        return 'Kitchen active';
      }
    }
  }
}
